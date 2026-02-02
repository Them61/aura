import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const handler: Handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Check for configuration
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('CRITICAL: STRIPE_SECRET_KEY is missing');
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Server configuration error' }),
    };
  }

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Empty request body' }),
      };
    }

    const { items, email, name: customerName } = JSON.parse(event.body);

    if (!items || !Array.isArray(items) || items.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Items are required and must be an array' }),
      };
    }

    // Determine if items are already in Stripe format or simplified
    const line_items = items.map((item) => {
      // If it's already in Stripe format (from frontend)
      if (item.price_data) {
        return {
          price_data: {
            ...item.price_data,
            currency: 'cad', // Force CAD
            unit_amount: Math.round(item.price_data.unit_amount), // Ensure integer
          },
          quantity: item.quantity || 1,
        };
      }
      
      // If it's simplified format
      const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
      return {
        price_data: {
          currency: 'cad',
          product_data: {
            name: item.name || 'Produit Aura',
            description: item.description || '',
          },
          unit_amount: Math.round(price * 100),
        },
        quantity: item.quantity || 1,
      };
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true,
      },
      success_url: `${process.env.URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL || 'http://localhost:3000'}/checkout`,
      metadata: {
        customer_name: customerName || '',
      },
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        id: session.id, // For legacy redirectToCheckout
        url: session.url // For modern direct redirect
      }),
    };
  } catch (error) {
    console.error('Error creating checkout session details:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to create checkout session' 
      }),
    };
  }
};
