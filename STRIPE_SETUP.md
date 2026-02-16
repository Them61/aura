# Configuration Stripe - Aura Microlocs

## 📋 Vue d'ensemble

Ce document explique comment configurer Stripe pour les paiements en ligne sur le site Aura Microlocs.

## 🔑 Variables d'environnement

### Frontend (déjà configuré)

Le frontend utilise uniquement la **clé publique** Stripe, qui peut être exposée dans le code :

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

Cette clé est chargée dans `pages/Checkout.tsx` via `import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY`.

### Backend (à configurer)

La **clé secrète** Stripe doit être utilisée UNIQUEMENT côté serveur :

```env
STRIPE_SECRET_KEY=sk_test_...
```

⚠️ **IMPORTANT** : Ne jamais exposer la clé secrète dans le code frontend ou dans le dépôt Git.

## 🚀 Étapes de configuration

### 1. Obtenir vos clés Stripe

1. Créez un compte sur [Stripe](https://stripe.com)
2. Accédez au [Tableau de bord Stripe](https://dashboard.stripe.com/apikeys)
3. Récupérez vos clés :
   - **Clé publique** (Publishable key) : `pk_test_...` ou `pk_live_...`
   - **Clé secrète** (Secret key) : `sk_test_...` ou `sk_live_...`

### 2. Configurer le frontend

1. Copiez `.env.example` vers `.env.local`
2. Ajoutez votre clé publique :
   ```env
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_ici
   ```
3. Redémarrez le serveur de développement

### 3. Créer l'endpoint backend

Vous devez créer un endpoint qui génère une session Stripe Checkout. Voici deux options :

#### Option A : Edge Function (Supabase)

Créez une fonction `create-checkout-session` :

```typescript
// supabase/functions/create-checkout-session/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno"

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
})

serve(async (req) => {
  try {
    const { items, email, name } = await req.json()

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: "cad",
          product_data: {
            name: item.price_data.product_data.name,
            description: item.price_data.product_data.description,
            images: item.price_data.product_data.images,
          },
          unit_amount: item.price_data.unit_amount,
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${req.headers.get("origin")}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/checkout?canceled=true`,
      customer_email: email,
      metadata: {
        customer_name: name,
      },
    })

    return new Response(JSON.stringify({ id: session.id }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
})
```

#### Option B : API Route (Node.js/Express)

```typescript
// api/create-checkout-session.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items, email, name } = req.body;

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
      success_url: `${req.headers.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/checkout?canceled=true`,
      customer_email: email,
      metadata: {
        customer_name: name,
      },
    });

    res.status(200).json({ id: session.id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
```

### 4. Configurer les webhooks (Essentiel pour la fiabilité)

Si vous recevez des erreurs de Stripe concernant une URL Supabase (ex: `lbqdgxxiaudvhjjpsmdx.supabase.co`), c'est qu'une ancienne configuration est active. Voici comment passer sur Netlify :

1. Dans le [Tableau de bord Stripe](https://dashboard.stripe.com/webhooks)
2. Supprimez l'ancien webhook Supabase s'il existe.
3. Créez un nouvel endpoint pointant vers : `https://votre-site.netlify.app/api/stripe-webhook`
4. Sélectionnez l'événement : `checkout.session.completed`
5. Copiez la **Clé secrète de signature** (Signing Secret) qui commence par `whsec_`.
6. Ajoutez cette clé dans vos variables d'environnement Netlify sous le nom : `STRIPE_WEBHOOK_SECRET`.

## 🧪 Mode test

Stripe fournit des cartes de test pour le développement :

- **Carte réussie** : `4242 4242 4242 4242`
- **Date d'expiration** : N'importe quelle date future
- **CVC** : N'importe quel 3 chiffres
- **Code postal** : N'importe quel code postal valide

## 📝 Notes importantes

1. **Taxes** : Les taxes du Québec (TPS/TVQ 14.975%) peuvent être :
   - Calculées côté frontend et incluses dans `unit_amount`
   - Ou configurées dans Stripe Dashboard (Tax Rates)

2. **Sécurité** : 
   - Ne jamais stocker la clé secrète dans le code frontend
   - Utilisez des variables d'environnement côté serveur
   - Validez toujours les montants côté serveur

3. **Production** :
   - Utilisez les clés `live` (`pk_live_...` et `sk_live_...`)
   - Configurez les webhooks en production
   - Testez soigneusement avant de passer en production

## 🔗 Ressources

- [Documentation Stripe](https://stripe.com/docs)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe Testing](https://stripe.com/docs/testing)
