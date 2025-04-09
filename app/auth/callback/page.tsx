'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'
  const [isRefreshing, setIsRefreshing] = useState(true)
  const { refreshAuth } = useAuth() // Get refreshAuth function from context
  
  // Debug helper
  const logCallback = (message: string, data: any = {}) => {
    console.log(`[AuthCallback] ${message}`, { ...data });
  }
  
  logCallback('Component rendered', { redirectTo });
  
  useEffect(() => {
    logCallback('useEffect fired');
    
    // This page explicitly refreshes the auth state client-side
    const refreshSession = async () => {
      logCallback('Starting session refresh');
      try {
        const supabase = createClient()
        logCallback('Supabase client created');
        
        // Log the current state before refresh
        const initialSessionCheck = await supabase.auth.getSession();
        logCallback('Initial session state before refresh', { 
          hasSession: !!initialSessionCheck.data.session,
          userId: initialSessionCheck.data.session?.user?.id,
          userEmail: initialSessionCheck.data.session?.user?.email
        });
        
        // This will force a refresh of the session
        logCallback('Calling getSession to refresh');
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('[AuthCallback] Error refreshing session:', error)
          logCallback('Session refresh error', { error });
        } else {
          logCallback('Session refreshed successfully', { 
            hasSession: !!data.session,
            userId: data.session?.user?.id,
            userEmail: data.session?.user?.email
          });
          
          // For debugging, also check the user directly
          const { data: { user } } = await supabase.auth.getUser();
          logCallback('User check after session refresh', { 
            hasUser: !!user,
            userId: user?.id,
            userEmail: user?.email
          });
        }
        
        // Critical change - use the AuthProvider's refreshAuth function
        // to ensure AuthProvider state is synchronized
        logCallback('Calling AuthProvider.refreshAuth to sync state');
        await refreshAuth();
        
        // Set a small timeout to ensure React state updates
        // and browser has time to process cookies/local storage
        logCallback('Starting redirect timeout');
        setTimeout(() => {
          logCallback('Timeout complete, preparing redirect');
          setIsRefreshing(false)
          
          // Final session check before redirect
          supabase.auth.getSession().then(({ data: { session } }) => {
            logCallback('Final session check before redirect', {
              hasSession: !!session,
              userId: session?.user?.id, 
              userEmail: session?.user?.email
            });
            
            // Log explicitly the final auth context state
            logCallback('Redirecting to:', { path: redirectTo });
            
            // Push to the final destination
            router.push(redirectTo)
          });
        }, 800) // Increased timeout for stability
      } catch (err) {
        console.error('[AuthCallback] Error in auth callback:', err)
        logCallback('Unexpected error during refresh', { error: err });
        // Still redirect, even on error
        setIsRefreshing(false)
        router.push(redirectTo)
      }
    }
    
    refreshSession()
    
    // Cleanup function
    return () => {
      logCallback('Component unmounting');
    }
  }, [redirectTo, router, refreshAuth]) // Add refreshAuth to dependencies
  
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Let's get you started..</p>
        <p className="text-xs text-muted-foreground mt-2">Logging you in, hold tight!</p>
      </div>
    </div>
  )
} 