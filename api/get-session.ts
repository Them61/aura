/**
 * API Route pour récupérer les détails d'une session Stripe
 * Compatible avec Vercel Serverless Functions et Netlify Functions
 */

import Stripe from 'stripe';

// Initialiser Stripe avec la clé secrète
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

/**
 * Handler pour récupérer une session Stripe
 */
export default async function handler(req: any, res: any) {
  // Vérifier que la méthode est GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Vérifier que la clé secrète Stripe est configurée
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY is not configured');
    return res.status(500).json({ error: 'Stripe configuration error' });
  }

  try {
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({ error: 'session_id is required' });
    }

    // Récupérer la session Stripe avec les détails des produits
    const session = await stripe.checkout.sessions.retrieve(session_id as string, {
      expand: ['line_items', 'line_items.data.price.product']
    });

    // Retourner les détails de la session
    return res.status(200).json({
      id: session.id,
      customer_email: session.customer_email,
      customer_details: session.customer_details,
      amount_total: session.amount_total,
      currency: session.currency,
      payment_status: session.payment_status,
      created: session.created,
      line_items: session.line_items?.data.map(item => ({
        description: item.description,
        price: {
          unit_amount: item.price?.unit_amount,
          currency: item.price?.currency,
        },
        quantity: item.quantity,
        product: {
          name: (item.price?.product as any)?.name,
          description: (item.price?.product as any)?.description,
        }
      }))
    });
  } catch (error: any) {
    console.error('Stripe Session Retrieval Error:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to retrieve session details' 
    });
  }
}