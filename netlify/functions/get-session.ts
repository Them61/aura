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
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'GET') {
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
    const sessionId = event.queryStringParameters?.session_id;

    if (!sessionId) {
      console.error('Missing session_id parameter');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Session ID is required' }),
      };
    }

    console.log('Retrieving session:', sessionId);

    // Retrieve the session with line items
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'line_items.data.price.product'],
    });

    console.log('Session retrieved successfully:', session.id);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(session),
    };
  } catch (error) {
    console.error('Error retrieving session:', error);
    
    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Failed to retrieve session';
    const errorType = error instanceof Error ? error.constructor.name : 'UnknownError';
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: errorMessage,
        type: errorType,
        details: 'Check Netlify function logs for more information'
      }),
    };
  }
};
