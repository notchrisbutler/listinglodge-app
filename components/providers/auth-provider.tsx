'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js'

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  refreshAuth: () => Promise<void>
}

type AuthProviderProps = {
  children: React.ReactNode
  // Removed initial props as they might be stale after server action redirects
  // initialUser: User | null
  // initialSession: Session | null
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true, // Start as loading
  refreshAuth: async () => {} // Provide default
})

// Removed initialUser, initialSession from props signature
export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  // Start loading, wait for client-side check
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  // Debug function to log state
  const logState = (message: string, data: any = {}) => {
    console.log(`[AuthProvider] ${message}`, {
      userId: user?.id,
      userEmail: user?.email,
      sessionId: session?.access_token?.substring(0, 10),
      isLoading,
      ...data
    });
  }

  // Explicit refresh function that component consumers can call
  const refreshAuth = useCallback(async () => {
    logState('Manual refreshAuth called');
    setIsLoading(true);
    
    try {
      // Force direct session check
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('[AuthProvider] Error in manual refresh:', error);
        logState('Manual refresh error', { error });
      } else if (data.session) {
        logState('Manual refresh successful', {
          newUserId: data.session.user.id,
          newUserEmail: data.session.user.email
        });
        
        // Update state directly
        setSession(data.session);
        setUser(data.session.user);
      } else {
        logState('Manual refresh - no session found');
        setSession(null);
        setUser(null);
      }
    } catch (err) {
      console.error('[AuthProvider] Unexpected error in manual refresh:', err);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    logState('Provider mounting');
    let isMounted = true

    // Refined state update function
    const updateAuthState = (event: AuthChangeEvent, newSession: Session | null) => {
      if (!isMounted) return;

      logState(`Auth state change event: ${event}`, { 
        newSessionId: newSession?.access_token?.substring(0, 10),
        newUserId: newSession?.user?.id,
        newUserEmail: newSession?.user?.email 
      });

      // Explicitly clear user/session on SIGNED_OUT
      if (event === 'SIGNED_OUT') {
        logState('SIGNED_OUT detected, clearing state');
        setSession(null);
        setUser(null);
      } else {
        // For other events (SIGNED_IN, TOKEN_REFRESHED, INITIAL_SESSION), update normally
        logState(`Updating state for event ${event}`);
        setSession(newSession);
        setUser(newSession?.user ?? null);
      }
      
      // Only set isLoading to false *after* the initial check or first event
      if (isLoading) {
        logState('Setting isLoading to false');
        setIsLoading(false);
      }
    }

    // 1. Set up the listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        logState(`onAuthStateChange fired: ${event}`);
        updateAuthState(event, currentSession);
      }
    )

    // 2. Immediately check the current session client-side
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      logState('Initial getSession result', { 
        hasSession: !!currentSession,
        sessionId: currentSession?.access_token?.substring(0, 10),
        userId: currentSession?.user?.id,
        userEmail: currentSession?.user?.email 
      });
      // Use 'INITIAL_SESSION' as the event type for the initial check
      updateAuthState('INITIAL_SESSION', currentSession);
    }).catch(error => {
        console.error("[AuthProvider] Error fetching initial session:", error);
        if (isMounted) setIsLoading(false);
    });

    // Log rendered state
    logState('Initial render complete');

    return () => {
      logState('Provider unmounting');
      isMounted = false
      subscription.unsubscribe()
    }
  }, [supabase, isLoading])

  // Log every render
  logState('Rendering provider');

  return (
    <AuthContext.Provider value={{ user, session, isLoading, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) 