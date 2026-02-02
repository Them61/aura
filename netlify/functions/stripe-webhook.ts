import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
  : null;

export const handler: Handler = async (event) => {
  console.log('Webhook event received:', event.httpMethod);

  // Check for required environment variables
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('CRITICAL: STRIPE_SECRET_KEY is not configured');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server configuration error: Missing STRIPE_SECRET_KEY' }),
    };
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('CRITICAL: STRIPE_WEBHOOK_SECRET is not configured');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server configuration error: Missing STRIPE_WEBHOOK_SECRET' }),
    };
  }

  const sig = event.headers['stripe-signature'];

  if (!sig) {
    console.error('Missing Stripe signature header');
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing Stripe signature' }),
    };
  }

  let stripeEvent: Stripe.Event;

  try {
    if (!event.body) {
      throw new Error('Empty request body');
    }
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    console.log('Webhook verified successfully. Event type:', stripeEvent.type);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: `Webhook signature verification failed: ${err.message}` }),
    };
  }

  // Handle the event
  try {
    if (stripeEvent.type === 'checkout.session.completed') {
      const session = stripeEvent.data.object as Stripe.Checkout.Session;
      console.log('Processing checkout.session.completed for session:', session.id);

      // Retrieve line items to have full details
      const sessionWithItems = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items'],
      });

      // Save order to Supabase (if configured)
      if (supabase) {
        try {
          const { error } = await supabase
            .from('orders')
            .insert([{
              session_id: session.id,
              customer_email: session.customer_details?.email || session.customer_email,
              customer_name: session.customer_details?.name,
              items: sessionWithItems.line_items?.data || [],
              amount_total: session.amount_total,
              currency: session.currency,
              payment_status: session.payment_status,
            }]);

          if (error) {
            console.error('Error saving order to Supabase:', error);
            // Continue anyway - order is paid, we just didn't save metadata
          } else {
            console.log('Order saved successfully to Supabase for session:', session.id);
          }
        } catch (supabaseErr: any) {
          console.error('Supabase connection error:', supabaseErr.message);
          // Continue - the important thing is that payment succeeded
        }
      } else {
        console.warn('Supabase not configured - skipping order save');
      }
    }

    // Always return 200 for any event we receive successfully
    console.log('Webhook processed successfully');
    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (err: any) {
    console.error('Error processing webhook event:', err.message);
    // Return 500 so Stripe retries
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process webhook' }),
    };
  }
};
