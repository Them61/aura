/**
 * Serveur Express pour le développement local
 * Utilisez ce serveur pour tester les API routes en local
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import Stripe from 'stripe';

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(cors({
  origin: process.env.VITE_DEV_SERVER_URL || 'http://localhost:3002',
  credentials: true,
}));
app.use(express.json());

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Routes API
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    console.log('Received checkout request:', req.body);
    
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not configured');
      return res.status(500).json({ error: 'Stripe configuration error' });
    }

    const { items, email, name } = req.body;

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items are required' });
    }

    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' });
    }

    // Get origin for redirect URLs
    const origin = req.headers.origin || req.headers.referer?.split('/').slice(0, 3).join('/') || 'http://localhost:3002';

    console.log('Creating Stripe session with origin:', origin);

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'cad',
          product_data: {
            name: item.price_data.product_data.name,
            description: item.price_data.product_data.description,
            images: item.price_data.product_data.images,
          },
          unit_amount: item.price_data.unit_amount,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${origin}/#/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#/checkout?canceled=true`,
      customer_email: email,
      metadata: {
        customer_name: name,
        order_date: new Date().toISOString(),
      },
    });

    console.log('Stripe session created:', session.id);
    return res.status(200).json({ id: session.id });
  } catch (error: any) {
    console.error('Error in checkout session route:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

app.get('/api/get-session', async (req, res) => {
  try {
    const { session_id } = req.query;
    
    if (!session_id || typeof session_id !== 'string') {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);
    return res.status(200).json(session);
  } catch (error: any) {
    console.error('Error in get session route:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 API endpoint: http://localhost:${PORT}/api/create-checkout-session`);
  console.log(`🔑 Stripe Secret Key: ${process.env.STRIPE_SECRET_KEY ? '✅ Configured' : '❌ Missing'}`);
});

export default app;
