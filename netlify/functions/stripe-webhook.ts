import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export const handler: Handler = async (event) => {
  const sig = event.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing signature or webhook secret' }),
    };
  }

  let stripeEvent: Stripe.Event;

  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body!, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: `Webhook Error: ${err.message}` }),
    };
  }

  // Handle the event
  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object as Stripe.Checkout.Session;

    // Retrieve line items to have full details
    const sessionWithItems = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items'],
    });

    // Save order to Supabase
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
      console.error('Error saving order to Supabase via webhook:', error);
      // We return 500 so Stripe retries later
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to save order' }),
      };
    }

    console.log('Order saved successfully via webhook for session:', session.id);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ received: true }),
  };
};
