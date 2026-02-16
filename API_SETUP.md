# Configuration API Routes - Aura Microlocs

## 📋 Vue d'ensemble

Ce guide explique comment configurer et utiliser les API Routes pour Stripe dans votre projet Aura Microlocs.

## 🚀 Options de déploiement

### Option 1 : Développement local (Express)

Pour tester les API routes en local, utilisez le serveur Express inclus.

#### Installation

```bash
npm install
```

#### Configuration

1. Ajoutez votre clé secrète Stripe dans `.env.local` :
   ```env
   STRIPE_SECRET_KEY=sk_test_votre_cle_secrete_ici
   ```

2. Démarrez le serveur API :
   ```bash
   npm run dev:server
   ```

3. Dans un autre terminal, démarrez le frontend :
   ```bash
   npm run dev
   ```

   Ou utilisez la commande combinée :
   ```bash
   npm run dev:all
   ```

Le serveur API sera accessible sur `http://localhost:3001` et le frontend sur `http://localhost:3000`. Vite proxy automatiquement les requêtes `/api/*` vers le serveur Express.

### Option 2 : Vercel (Recommandé)

Vercel détecte automatiquement les fichiers dans le dossier `api/` et les déploie comme Serverless Functions.

#### Configuration

1. **Installez Vercel CLI** (optionnel) :
   ```bash
   npm i -g vercel
   ```

2. **Déployez** :
   ```bash
   vercel
   ```

3. **Configurez les variables d'environnement** :
   - Allez sur [Vercel Dashboard](https://vercel.com/dashboard)
   - Sélectionnez votre projet
   - Allez dans Settings > Environment Variables
   - Ajoutez `STRIPE_SECRET_KEY` avec votre clé secrète

4. **Redéployez** :
   ```bash
   vercel --prod
   ```

Le fichier `vercel.json` est déjà configuré pour router les requêtes `/api/*` vers les Serverless Functions.

### Option 3 : Netlify

Netlify utilise le dossier `netlify/functions/` pour les fonctions serverless.

#### Configuration

1. **Installez Netlify CLI** (optionnel) :
   ```bash
   npm i -g netlify-cli
   ```

2. **Déployez** :
   ```bash
   netlify deploy --prod
   ```

3. **Configurez les variables d'environnement** :
   - Allez sur [Netlify Dashboard](https://app.netlify.com)
   - Sélectionnez votre site
   - Allez dans Site settings > Environment variables
   - Ajoutez `STRIPE_SECRET_KEY` avec votre clé secrète

Le fichier `netlify.toml` est déjà configuré pour router les requêtes `/api/*` vers les fonctions Netlify.

## 🔧 Structure des fichiers

```
projetc-ttesst/
├── api/
│   └── create-checkout-session.ts    # Vercel Serverless Function
├── netlify/
│   └── functions/
│       └── create-checkout-session.ts # Netlify Function
├── server/
│   └── index.ts                       # Serveur Express (dev local)
├── vercel.json                        # Configuration Vercel
└── netlify.toml                       # Configuration Netlify
```

## 🧪 Tester l'API

### En développement local

1. Démarrez le serveur API : `npm run dev:server`
2. Démarrez le frontend : `npm run dev`
3. Testez un paiement sur `/checkout`

### Avec curl

```bash
curl -X POST http://localhost:3001/api/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{
      "price_data": {
        "currency": "cad",
        "product_data": {
          "name": "Test Product",
          "description": "Test Description"
        },
        "unit_amount": 1000
      },
      "quantity": 1
    }],
    "email": "test@example.com",
    "name": "Test User"
  }'
```

## 📝 Variables d'environnement requises

### Frontend (`.env.local`)
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_STRIPE_API_ENDPOINT=/api/create-checkout-session
```

### Backend (`.env.local` pour dev, ou Dashboard pour production)
```env
STRIPE_SECRET_KEY=sk_test_...
```

## 🔒 Sécurité

- ✅ La clé publique (`pk_test_...`) peut être exposée dans le frontend
- ❌ La clé secrète (`sk_test_...`) doit rester côté serveur uniquement
- ✅ Utilisez toujours HTTPS en production
- ✅ Validez les montants côté serveur (ne faites jamais confiance au client)

## 🐛 Dépannage

### Erreur : "STRIPE_SECRET_KEY is not configured"

- Vérifiez que la variable d'environnement est définie
- En local : vérifiez `.env.local`
- Sur Vercel/Netlify : vérifiez les variables d'environnement dans le dashboard

### Erreur : "Method not allowed"

- Vérifiez que vous utilisez `POST` et non `GET`
- Vérifiez l'URL de l'endpoint

### Erreur CORS

- En développement local, le proxy Vite devrait gérer cela automatiquement
- Sur Vercel/Netlify, les headers CORS sont configurés dans les fonctions

## 📚 Ressources

- [Documentation Stripe](https://stripe.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
