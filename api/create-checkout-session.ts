/**
 * API Route pour créer une session Stripe Checkout
 * Compatible avec Vercel Serverless Functions et Netlify Functions
 */

import Stripe from 'stripe';

// Types pour les requêtes
interface CheckoutRequest {
  items: Array<{
    price_data: {
      currency: string;
      product_data: {
        name: string;
        description?: string;
        images?: string[];
      };
      unit_amount: number;
    };
    quantity: number;
  }>;
  email: string;
  name: string;
}

// Initialiser Stripe avec la clé secrète
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

/**
 * Handler pour Vercel Serverless Functions
 */
export default async function handler(req: any, res: any) {
  // Vérifier que la méthode est POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Vérifier que la clé secrète Stripe est configurée
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY is not configured');
    return res.status(500).json({ error: 'Stripe configuration error' });
  }

  try {
    const { items, email, name }: CheckoutRequest = req.body;

    // Validation des données
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items are required' });
    }

    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' });
    }

    // Obtenir l'origine de la requête pour les URLs de redirection
    const origin = req.headers.origin || req.headers.referer?.split('/').slice(0, 3).join('/') || 'http://localhost:3000';

    // Créer la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item) => ({
        price_data: {
          currency: 'cad',
          product_data: {
            name: item.price_data.product_data.name,
            description: item.price_data.product_data.description,
            images: item.price_data.product_data.images,
          },
          unit_amount: item.price_data.unit_amount, // Montant en centimes
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?canceled=true`,
      customer_email: email,
      metadata: {
        customer_name: name,
        order_date: new Date().toISOString(),
      },
      // Taxes du Québec (optionnel - peut aussi être géré par Stripe Tax)
      // automatic_tax: { enabled: true }, // Activez Stripe Tax si configuré
    });

    // Retourner l'ID de la session
    return res.status(200).json({ id: session.id });
  } catch (error: any) {
    console.error('Stripe Checkout Session Error:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to create checkout session' 
    });
  }
}
