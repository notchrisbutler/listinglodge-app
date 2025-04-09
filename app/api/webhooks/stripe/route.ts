import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe' // Use the initialized Stripe client from lib
import { createClient } from '@supabase/supabase-js' // Import Supabase JS client
import type { Database, TablesInsert, TablesUpdate, Enums } from '@/types/supabase' // Import Supabase types

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
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set')
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
}

// Disable default body parsing for this route to access the raw body
export const dynamic = "force-dynamic"; // Make sure the route is not statically optimized

// Supabase Admin Client - Initialized outside handler for potential reuse
// Uses SERVICE_ROLE_KEY for elevated privileges
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Helper function to safely truncate metadata values to stay within Stripe's 500 character limit
function sanitizeMetadata(metadata: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(metadata)) {
    if (typeof value === 'string' && value.length > 500) {
      // Truncate string values longer than 500 characters
      sanitized[key] = value.substring(0, 497) + '...';
      console.log(`Truncated metadata value for key '${key}' from ${value.length} to 500 characters`);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

// Helper function to read raw body from ReadableStream into a Buffer
async function buffer(readable: ReadableStream<Uint8Array> | null): Promise<Buffer> {
  if (!readable) {
    throw new Error('Missing request body stream');
  }
  
  try {
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
  } catch (error) {
    console.error('Error reading from stream:', error);
    throw new Error(`Stream reading error: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Process webhook event asynchronously (after sending response)
async function processWebhookEvent(event: Stripe.Event): Promise<void> {
  console.log(`🔄 Processing Stripe event: ${event.type} (${event.id})`);
  
  try {
    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      
      // Log the entire session object for debugging
      console.log('Full session object:', JSON.stringify({
        id: session.id,
        status: session.status,
        payment_status: session.payment_status,
        mode: session.mode,
        metadata: session.metadata,
        customer: typeof session.customer === 'string' ? session.customer : session.customer?.id,
        payment_intent: typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id,
        has_line_items: session.line_items !== undefined
      }, null, 2));
      
      const metadata = session.metadata as CheckoutSessionMetadata | null

      // Validate required metadata
      if (!metadata || !metadata.userId || !metadata.packageId) {
        console.error(
          'Webhook Error: Missing or invalid metadata in session:', 
          session.id,
          JSON.stringify(metadata)
        )
        return;
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
        return;
      }

      console.log(
        `Processing successful checkout for user: ${userId}, package: ${packageId}, tokens: ${tokensToAdd}`
      )

      try {
        // Call the SQL function to add tokens and log, handling idempotency
        const { data: logId, error: rpcError } = await supabaseAdmin.rpc(
          'add_tokens_and_log',
          {
            user_target_id: userId,
            amount_to_add: tokensToAdd,
            change_meta: sanitizeMetadata({
              stripe_session_id: stripeSessionId,
              stripe_charge_id: typeof stripeChargeId === 'string' ? stripeChargeId : stripeChargeId?.id,
              package_id: packageId,
            }),
            idempotency_key: event.id, // Use Stripe event ID for idempotency
          }
        )

        if (rpcError) {
          // The RPC function handles unique_violation internally and returns null.
          // Other errors are genuine problems.
          console.error(
            `RPC Error processing event ${event.id} for user ${userId}:`,
            rpcError.message,
            JSON.stringify(rpcError, null, 2)
          )
          return;
        }

        if (logId === null) {
            // This indicates the RPC function detected a duplicate via the idempotency key
            console.log(`Idempotency check: Event ${event.id} already processed.`);
        } else {
            console.log(`✅ Successfully added ${tokensToAdd} tokens for user ${userId}. Log ID: ${logId}`);
        }
      } catch (err: any) {
        console.error(`Unexpected error in RPC call for event ${event.id}:`, err.message, err.stack);
      }

    } else {
      // Handle other event types if needed
      console.log(`Received unhandled event type: ${event.type}`)
    }
  } catch (error: any) {
    console.error(`❌ Error processing webhook event ${event.type} (${event.id}):`, error.message);
  }
}

export async function POST(req: NextRequest) {
  console.log('⚡ Stripe webhook received');
  const startTime = Date.now();
  const reqHeaders = headers(); // Get request headers
  const signature = reqHeaders.get('stripe-signature');

  if (!signature) {
    console.error('❌ Missing stripe-signature header');
    return NextResponse.json(
      { error: 'Webhook Error: Missing signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    // Read the raw body - but keep this quick
    const rawBody = await buffer(req.body);
    
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    
    // Important: Return a 200 response immediately
    console.log(`✅ Verified Stripe event: ${event.type} (${event.id}). Processing asynchronously...`);
    
    // Process the event asynchronously to avoid timeouts
    processWebhookEvent(event).catch(err => {
      console.error(`❌ Async processing error for ${event.id}:`, err);
    });
    
    // Return success response immediately
    const responseTime = Date.now() - startTime;
    return NextResponse.json(
      { received: true, processingTime: `${responseTime}ms` }, 
      { status: 200 }
    );
  } catch (err: any) {
    console.error(`❌ Webhook verification failed:`, err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }
} 