import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe' // Use the initialized Stripe client from lib
import { createClient } from '@supabase/supabase-js' // Import Supabase JS client

// Define types for expected metadata (Ensure consistency with Server Action)
interface CheckoutSessionMetadata {
  userId: string
  packageId: '30' | '100' | '250' // Match package IDs used elsewhere
}

// Mapping package IDs to token amounts
const TOKENS_PER_PACKAGE: Record<CheckoutSessionMetadata['packageId'], number> = {
  '30': 30,   // Assuming package '30' gives 30 tokens
  '100': 100, // Assuming package '100' gives 100 tokens
  '250': 250, // Assuming package '250' gives 250 tokens
}

// Ensure essential environment variables are available
if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('STRIPE_WEBHOOK_SECRET is not set')
}
if (!process.env.SUPABASE_URL) {
  throw new Error('SUPABASE_URL is not set')
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
}

// Disable default body parsing for this route to access the raw body
export const config = {
  api: {
    bodyParser: false,
  },
}

// Supabase Admin Client - Initialized outside handler for potential reuse
// Uses SERVICE_ROLE_KEY for elevated privileges
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Helper function to read raw body from ReadableStream into a Buffer
async function buffer(readable: ReadableStream<Uint8Array>): Promise<Buffer> {
  const reader = readable.getReader();
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    if (value) {
        chunks.push(value);
    }
  }

  return Buffer.concat(chunks);
}

export async function POST(req: NextRequest) {
  const reqHeaders = headers() // Get request headers
  const signature = reqHeaders.get('stripe-signature')

  // Read the raw body
  let rawBody: Buffer
  try {
    if (!req.body) {
        throw new Error('Request body is missing');
    }
    rawBody = await buffer(req.body)
  } catch (err: any) {
    console.error('Error reading raw request body:', err.message)
    return NextResponse.json(
      { error: `Webhook Error: Could not read body: ${err.message}` },
      { status: 400 }
    )
  }

  let event: Stripe.Event
  try {
    // Verify webhook signature
    if (!signature) {
      throw new Error('Stripe-Signature header is missing')
    }

    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
    console.log(`Received Stripe event: ${event.type} (${event.id})`)

  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json(
      { error: `Webhook signature error: ${err.message}` },
      { status: 400 }
    )
  }

  try {
    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const metadata = session.metadata as CheckoutSessionMetadata | null

      // Validate required metadata
      if (!metadata || !metadata.userId || !metadata.packageId) {
        console.error(
          'Webhook Error: Missing or invalid metadata in session:', session.id,
          metadata
        )
        return NextResponse.json(
          { error: 'Webhook Error: Missing required metadata (userId, packageId).' },
          { status: 400 }
        )
      }

      const userId = metadata.userId
      const packageId = metadata.packageId
      const tokensToAdd = TOKENS_PER_PACKAGE[packageId]
      const stripeChargeId = session.payment_intent // string | null | Stripe.PaymentIntent
      const stripeSessionId = session.id

      if (!tokensToAdd) {
        console.error(
          `Webhook Error: Invalid packageId '${packageId}' found in metadata for session ${stripeSessionId}`
        )
        return NextResponse.json(
          { error: `Webhook Error: Invalid packageId '${packageId}'.` },
          { status: 400 }
        )
      }

      console.log(
        `Processing successful checkout for user: ${userId}, package: ${packageId}, tokens: ${tokensToAdd}`
      )

      // Call the SQL function to add tokens and log, handling idempotency
      const { data: logId, error: rpcError } = await supabaseAdmin.rpc(
        'add_tokens_and_log',
        {
          user_target_id: userId,
          amount_to_add: tokensToAdd,
          change_meta: {
            stripe_session_id: stripeSessionId,
            stripe_charge_id: typeof stripeChargeId === 'string' ? stripeChargeId : stripeChargeId?.id,
            package_id: packageId,
          },
          idempotency_key: event.id, // Use Stripe event ID for idempotency
        }
      )

      if (rpcError) {
        // The RPC function handles unique_violation internally and returns null.
        // Other errors are genuine problems.
        console.error(
          `RPC Error processing event ${event.id} for user ${userId}:`,
          rpcError.message
        )
        return NextResponse.json(
          { error: `Database update error: ${rpcError.message}` },
          { status: 500 }
        )
      }

      if (logId === null) {
          // This indicates the RPC function detected a duplicate via the idempotency key
          console.log(`Idempotency check: Event ${event.id} already processed.`);
      } else {
          console.log(`Successfully added ${tokensToAdd} tokens for user ${userId}. Log ID: ${logId}`);
      }

      // Return 200 OK even if it was a duplicate - Stripe expects this.
      return NextResponse.json({ received: true }, { status: 200 })

    } else {
      // Handle other event types if needed
      console.log(`Received unhandled event type: ${event.type}`)
    }

    // Default success response if event type wasn't 'checkout.session.completed'
    return NextResponse.json({ received: true }, { status: 200 })

  } catch (error: any) {
    console.error('Error processing webhook event:', error.message)
    return NextResponse.json(
      { error: `Webhook handler error: ${error.message}` },
      { status: 500 }
    )
  }
} 