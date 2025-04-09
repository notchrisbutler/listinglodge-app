'use server' // Mark this file as Server Actions

import { createClient } from '@/lib/supabase/server' // Use your server Supabase client
import { stripe } from '@/lib/stripe'
import { absoluteUrl } from '@/lib/utils' // Assumes you have this helper, adjust if needed
import { redirect } from 'next/navigation'

// Define the structure of the data expected by the action
interface CreateCheckoutSessionData {
  packageId: '30' | '100' | '250' // Matches your TokenPackage['id'] type
}

// --- IMPORTANT ---
// Replace these placeholders with your ACTUAL Stripe Price IDs
// Store these securely in your environment variables (.env.local)
const STRIPE_PRICE_IDS = {
  '30': process.env.STRIPE_PRICE_ID_30_TOKENS!, // e.g., price_1PExample...
  '100': process.env.STRIPE_PRICE_ID_100_TOKENS!,
  '250': process.env.STRIPE_PRICE_ID_250_TOKENS!,
}

// --- IMPORTANT ---
// Ensure NEXT_PUBLIC_SITE_URL is set in your .env.local (e.g., http://localhost:3000)
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
if (!siteUrl) {
    throw new Error("NEXT_PUBLIC_SITE_URL environment variable is not set.");
}

// Helper function to create absolute URLs (if not already in lib/utils)
// export function absoluteUrl(path: string) {
//   return `${siteUrl}${path}`
// }


export async function createStripeCheckoutSession(
  data: CreateCheckoutSessionData
) {
  const supabase = createClient() // Create Supabase server client

  // 1. Authentication Check
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    console.error('Stripe Checkout: User not authenticated.')
    redirect('/login?message=Authentication required') // Redirect to login
  }

  const { packageId } = data

  // 2. Validate Input
  const priceId = STRIPE_PRICE_IDS[packageId];
  if (!packageId || !priceId) {
    console.error('Stripe Checkout: Invalid package ID provided or missing Price ID.', packageId)
    // Returning an object for the frontend to handle
    return { error: 'Invalid package selected or configuration error.' }
  }
  if (!priceId.startsWith('price_')) {
     console.warn(`Stripe Checkout: Price ID for package '${packageId}' seems invalid (doesn't start with 'price_'): ${priceId}`);
     // Consider returning an error here if you're sure env vars are set
     // return { error: 'Server configuration error for token packages.' }
  }


  // Use absoluteUrl helper if available, otherwise construct directly
  const successUrl = `${siteUrl}/dashboard?purchase=success&session_id={CHECKOUT_SESSION_ID}`
  const cancelUrl = `${siteUrl}/dashboard?purchase=cancelled`

  try {
    // 3. Create Stripe Checkout Session
    console.log(`Creating Stripe session for user ${user.id} with price ${priceId}`);
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: user.id, // Pass Supabase user ID
        packageId: packageId,
      },
      // Optional: Pre-fill user's email for convenience
      customer_email: user.email,
    })

    // 4. Redirect to Stripe URL
    if (!checkoutSession.url) {
      console.error('Stripe Checkout: Session URL is missing from response.')
      return { error: 'Could not create checkout session. Please try again.' }
    }

    console.log(`Redirecting user ${user.id} to Stripe Checkout: ${checkoutSession.url}`);
    redirect(checkoutSession.url) // Server-side redirect

  } catch (error: any) {
    console.error('Stripe Checkout Error:', error.message)
    // Return a generic error to the client
    return { error: 'An error occurred during checkout setup. Please try again.' }
  }
}