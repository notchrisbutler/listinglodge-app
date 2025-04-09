import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

// Declare the client variable in the module scope
let supabaseClient: SupabaseClient | null = null;

export function createClient() {
  // If the client doesn't exist yet, create it
  if (!supabaseClient) {
    supabaseClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  // Return the existing or newly created client
  return supabaseClient;
} 