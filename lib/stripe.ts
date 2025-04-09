import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  // Ensure you have STRIPE_SECRET_KEY in your .env.local or environment
  throw new Error('STRIPE_SECRET_KEY environment variable is not set.')
}

// Initialize Stripe with the API key and specify the API version
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-03-31.basil', // Use the latest stable API version
  typescript: true, // Enable TypeScript support
})