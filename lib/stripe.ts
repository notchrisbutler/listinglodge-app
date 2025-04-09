import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  // Ensure you have STRIPE_SECRET_KEY in your .env.local or environment
  throw new Error('STRIPE_SECRET_KEY environment variable is not set.')
}

// Initialize Stripe with the API key and specify the API version
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia' as any, // Use the latest stable API version
  typescript: true, // Enable TypeScript support
  appInfo: {
    name: 'ListingLodge',
    version: '1.0.0',
  },
  telemetry: false, // Disable telemetry for potentially faster webhook processing
})

// Helper function for webhook verification
export const constructWebhookEvent = (
  payload: string,
  signature: string,
  webhookSecret: string
): Stripe.Event => {
  try {
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
  } catch (err: any) {
    console.error(`⚠️ Webhook signature verification failed: ${err.message}`)
    throw new Error(`Webhook Error: ${err.message}`)
  }
}