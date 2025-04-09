'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  const supabase = createClient()
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) {
    return { error: error.message }
  }
  
  // Set a special cookie to indicate we need to refresh auth state
  cookies().set('auth_action_refresh', 'true', {
    maxAge: 10, // Short-lived cookie
    path: '/',
    sameSite: 'lax', // Add proper SameSite attribute
    secure: process.env.NODE_ENV === 'production', // Only use secure in production
    httpOnly: true // Best practice for cookies not needed in client JS
  })
  
  // Redirect to a special callback route first
  redirect('/auth/callback?redirect=/')
}

export async function register(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const firstName = formData.get('first-name') as string
  const lastName = formData.get('last-name') as string
  
  const supabase = createClient()
  
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  })
  
  if (error) {
    return { error: error.message }
  }
  
  // Set a special cookie to indicate we need to refresh auth state
  cookies().set('auth_action_refresh', 'true', {
    maxAge: 10, // Short-lived cookie
    path: '/',
    sameSite: 'lax', // Add proper SameSite attribute
    secure: process.env.NODE_ENV === 'production', // Only use secure in production
    httpOnly: true // Best practice for cookies not needed in client JS
  })
  
  // Redirect to a special callback route first
  redirect('/auth/callback?redirect=/')
}

export async function logout() {
  const supabase = createClient()
  await supabase.auth.signOut()
  
  // For logout, clear cookies and redirect directly
  // Since we're removing auth, no callback is needed
  cookies().set('auth_action_refresh', '', { 
    maxAge: 0,
    path: '/',
    sameSite: 'lax', // Add proper SameSite attribute
    secure: process.env.NODE_ENV === 'production', // Only use secure in production
    httpOnly: true
  })
  
  redirect('/login')
} 