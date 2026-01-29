/**
 * Serveur Express pour le développement local
 * Utilisez ce serveur pour tester les API routes en local
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

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

// Routes API
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    // Importer dynamiquement le handler
    const { default: handler } = await import('../api/create-checkout-session.js');
    await handler(req, res);
  } catch (error: any) {
    console.error('Error in checkout session route:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

app.get('/api/get-session', async (req, res) => {
  try {
    // Importer dynamiquement le handler
    const { default: handler } = await import('../api/get-session.js');
    await handler(req, res);
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
