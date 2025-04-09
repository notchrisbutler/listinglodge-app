'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User, Session, AuthChangeEvent, RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { type Tables } from '@/types/supabase' // Import Tables type

type TokenWallet = Tables<'token_wallet'> // Define TokenWallet type

type AuthContextType = {
  user: User | null
  session: Session | null
  tokenWallet: TokenWallet | null // Add token wallet to context
  isLoading: boolean
  refreshAuth: () => Promise<void>
  refreshTokenBalance: () => Promise<void> // Add function to refresh token balance
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
  tokenWallet: null, // Initialize token wallet state
  isLoading: true,
  refreshAuth: async () => {},
  refreshTokenBalance: async () => {} // Provide default
})

// Removed initialUser, initialSession from props signature
export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [tokenWallet, setTokenWallet] = useState<TokenWallet | null>(null) // Add token wallet state
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  // Debug function to log state
  const logState = (message: string, data: any = {}) => {
    console.log(`[AuthProvider] ${message}`, {
      userId: user?.id,
      userEmail: user?.email,
      sessionId: session?.access_token?.substring(0, 10),
      tokenBalance: tokenWallet?.balance, // Add token balance to logs
      isLoading,
      ...data
    });
  }

  // Subscribe to token wallet changes for real-time updates
  useEffect(() => {
    if (!user?.id) return;
    
    logState('Setting up real-time token wallet subscription', { userId: user.id });
    
    // Set up real-time subscription to token_wallet changes
    const walletSubscription = supabase
      .channel('token_wallet_changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'token_wallet',
          filter: `user_id=eq.${user.id}`,
        },
        async (payload) => {
          // Type assertion for payload data
          const newData = payload.new as TokenWallet | null;
          const oldData = payload.old as Partial<TokenWallet> | null;
          
          logState('Real-time token wallet update received', { 
            eventType: payload.eventType,
            newBalance: newData?.balance,
            oldBalance: oldData?.balance
          });
          
          // Refresh token balance when changes are detected
          await refreshTokenBalance();
        }
      )
      .subscribe();
    
    return () => {
      logState('Cleaning up token wallet subscription');
      walletSubscription.unsubscribe();
    };
  }, [user?.id]); // Re-subscribe when user ID changes

  // Function to fetch token wallet
  const fetchTokenWallet = useCallback(async (userId: string) => {
    if (!userId) return null;
    logState('Fetching token wallet', { userId });
    try {
      const { data, error } = await supabase
        .from('token_wallet')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('[AuthProvider] Error fetching token wallet:', error);
        logState('Token wallet fetch error', { error });
        return null;
      }

      logState('Token wallet fetch successful', { balance: data?.balance });
      return data;
    } catch (err) {
      console.error('[AuthProvider] Unexpected error fetching token wallet:', err);
      return null;
    }
  }, [supabase]);

  // Function to refresh token balance only
  const refreshTokenBalance = useCallback(async () => {
    if (!user?.id) return;
    logState('Refreshing token balance');
    
    try {
      const wallet = await fetchTokenWallet(user.id);
      setTokenWallet(wallet);
      logState('Token balance refreshed', { balance: wallet?.balance });
    } catch (err) {
      console.error('[AuthProvider] Error refreshing token balance:', err);
    }
  }, [user?.id, fetchTokenWallet]);

  // Explicit refresh function that component consumers can call
  const refreshAuth = useCallback(async () => {
    logState('Manual refreshAuth called');
    setIsLoading(true);
    setTokenWallet(null); // Clear token wallet during refresh

    try {
      // Force direct session check
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('[AuthProvider] Error in manual refresh:', error);
        logState('Manual refresh error', { error });
        setSession(null);
        setUser(null);
      } else if (data.session) {
        logState('Manual refresh successful', {
          newUserId: data.session.user.id,
          newUserEmail: data.session.user.email
        });

        // Update state directly
        setSession(data.session);
        setUser(data.session.user);
        
        const wallet = await fetchTokenWallet(data.session.user.id);
        setTokenWallet(wallet);
      } else {
        logState('Manual refresh - no session found');
        setSession(null);
        setUser(null);
        setTokenWallet(null); // Ensure token wallet is cleared
      }
    } catch (err) {
      console.error('[AuthProvider] Unexpected error in manual refresh:', err);
      setSession(null);
      setUser(null);
      setTokenWallet(null);
    } finally {
      setIsLoading(false);
    }
  }, [supabase, fetchTokenWallet]);

  useEffect(() => {
    logState('Provider mounting');
    let isMounted = true;

    // Refined state update function
    const updateAuthState = async (event: AuthChangeEvent, newSession: Session | null) => {
      if (!isMounted) return;

      logState(`Auth state change event: ${event}`, {
        newSessionId: newSession?.access_token?.substring(0, 10),
        newUserId: newSession?.user?.id,
        newUserEmail: newSession?.user?.email
      });

      let currentWallet: TokenWallet | null = null;
      let currentUser: User | null = newSession?.user ?? null;

      // Explicitly clear user/session on SIGNED_OUT
      if (event === 'SIGNED_OUT') {
        logState('SIGNED_OUT detected, clearing state');
        currentUser = null;
        currentWallet = null;
      } else if (currentUser) {
        // For other events (SIGNED_IN, TOKEN_REFRESHED, INITIAL_SESSION), update normally
        logState(`Updating state for event ${event}`);
        // Fetch token wallet if user exists
        currentWallet = await fetchTokenWallet(currentUser.id);
      } else {
         currentWallet = null;
      }

      // Update state together
      if (isMounted) {
          setSession(newSession);
          setUser(currentUser);
          setTokenWallet(currentWallet);
          logState('State updated after auth change/fetch', { 
            hasUser: !!currentUser, 
            hasWallet: !!currentWallet,
            tokenBalance: currentWallet?.balance
          });

         // Only set isLoading to false *after* the initial check or first event
          if (isLoading) {
            logState('Setting isLoading to false');
            setIsLoading(false);
          }
      }
    };

    // 1. Set up the listener
    const { data: { subscription: authListenerSubscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        logState(`onAuthStateChange fired: ${event}`);
        updateAuthState(event, currentSession);
      }
    );

    // 2. Immediately check the current session client-side
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      logState('Initial getSession result', {
        hasSession: !!currentSession,
        sessionId: currentSession?.access_token?.substring(0, 10),
        userId: currentSession?.user?.id,
        userEmail: currentSession?.user?.email
      });
      // Use 'INITIAL_SESSION' as the event type for the initial check
      // This will trigger the token wallet fetch inside updateAuthState
      updateAuthState('INITIAL_SESSION', currentSession);
    }).catch(error => {
        console.error("[AuthProvider] Error fetching initial session:", error);
        if (isMounted) setIsLoading(false); // Still stop loading on error
    });

    // Log rendered state
    logState('Initial render setup complete');

    return () => {
      logState('Provider unmounting');
      isMounted = false;
      authListenerSubscription.unsubscribe();
    };
  }, [supabase, isLoading, fetchTokenWallet]);

  // Log every render
  logState('Rendering provider');

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      tokenWallet, 
      isLoading, 
      refreshAuth,
      refreshTokenBalance 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) 