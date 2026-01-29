# Guide de déploiement Netlify - Aura Microlocs

## 📋 Vue d'ensemble

Ce guide vous accompagne étape par étape pour déployer votre application Aura Microlocs sur Netlify avec les API Routes Stripe.

## 🚀 Déploiement rapide (5 minutes)

### Option 1 : Via l'interface Netlify (Recommandé pour débutants)

1. **Préparer votre projet**
   ```bash
   # Assurez-vous que votre code est sur GitHub, GitLab ou Bitbucket
   git add .
   git commit -m "Ready for Netlify deployment"
   git push
   ```

2. **Connecter à Netlify**
   - Allez sur [netlify.com](https://www.netlify.com)
   - Cliquez sur "Sign up" ou "Log in"
   - Cliquez sur "Add new site" > "Import an existing project"
   - Connectez votre dépôt Git (GitHub, GitLab, ou Bitbucket)
   - Sélectionnez votre dépôt

3. **Configurer le build**
   - **Branch to deploy** : `main` (ou `master` si c'est votre branche principale)
   - **Base directory** : Laissez vide (ou `/` si votre projet est à la racine)
   - **Build command** : `npm run build`
   - **Publish directory** : `dist`
   - Netlify détectera automatiquement `netlify.toml` si présent

4. **Configurer les variables d'environnement**
   - Avant de déployer, cliquez sur "Show advanced"
   - Cliquez sur "New variable"
   - Ajoutez ces variables :
     ```
     GEMINI_API_KEY = your_gemini_api_key_here
     VITE_STRIPE_PUBLISHABLE_KEY = pk_test_your_publishable_key_here
     STRIPE_SECRET_KEY = sk_test_your_secret_key_here
     ```

5. **Déployer**
   - Cliquez sur "Deploy site"
   - Attendez que le build se termine (2-5 minutes)

6. **Vérifier le déploiement**
   - Une fois terminé, vous obtiendrez une URL comme `https://votre-site.netlify.app`
   - Testez votre site et les paiements Stripe

### Option 2 : Via Netlify CLI (Recommandé pour développeurs)

1. **Installer Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Se connecter à Netlify**
   ```bash
   netlify login
   ```
   Cela ouvrira votre navigateur pour vous authentifier.

3. **Initialiser le projet**
   ```bash
   netlify init
   ```
   Répondez aux questions :
   - "Create & configure a new site" (ou connecter à un site existant)
   - Choisissez votre équipe
   - Nommez votre site (optionnel)

4. **Configurer les variables d'environnement**
   ```bash
   netlify env:set GEMINI_API_KEY "your_gemini_api_key"
   netlify env:set VITE_STRIPE_PUBLISHABLE_KEY "pk_test_your_publishable_key"
   netlify env:set STRIPE_SECRET_KEY "sk_test_your_secret_key"
   ```

5. **Déployer**
   ```bash
   netlify deploy --prod
   ```

## 📁 Structure des fichiers Netlify

Votre projet est déjà configuré avec :

```
projetc-ttesst/
├── netlify.toml              # Configuration Netlify
└── netlify/
    └── functions/
        └── create-checkout-session.ts  # Fonction serverless Stripe
```

## ⚙️ Configuration détaillée

### Fichier `netlify.toml`

Le fichier est déjà configuré avec :

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

**Explication :**
- `command` : Commande pour construire votre application
- `publish` : Dossier contenant les fichiers statiques après le build
- `redirects` : Redirige toutes les requêtes `/api/*` vers les fonctions Netlify
- `NODE_VERSION` : Version de Node.js à utiliser

### Fonction serverless

La fonction `netlify/functions/create-checkout-session.ts` est automatiquement détectée par Netlify et déployée comme fonction serverless.

## 🔐 Variables d'environnement

### Variables requises

| Variable | Description | Où l'obtenir |
|----------|-------------|--------------|
| `GEMINI_API_KEY` | Clé API Google Gemini | [Google AI Studio](https://makersuite.google.com/app/apikey) |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Clé publique Stripe | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) |

### Comment les configurer

#### Via l'interface Netlify

1. Allez sur votre site dans le [Netlify Dashboard](https://app.netlify.com)
2. Cliquez sur **Site settings**
3. Allez dans **Environment variables**
4. Cliquez sur **Add variable**
5. Ajoutez chaque variable avec sa valeur
6. Cliquez sur **Save**

#### Via CLI

```bash
# Variables individuelles
netlify env:set VARIABLE_NAME "valeur"

# Ou importez depuis un fichier .env
netlify env:import .env.local
```

⚠️ **Important** : Les variables d'environnement sont sensibles. Ne les partagez jamais publiquement.

## 🧪 Tester après déploiement

1. **Vérifier le site**
   - Visitez votre URL Netlify (ex: `https://votre-site.netlify.app`)
   - Vérifiez que toutes les pages se chargent correctement

2. **Tester l'API Stripe**
   - Allez sur `/services`
   - Ajoutez un produit au panier
   - Allez au checkout
   - Utilisez la carte de test : `4242 4242 4242 4242`
   - Date d'expiration : n'importe quelle date future
   - CVC : n'importe quel 3 chiffres

3. **Vérifier les logs**
   - Dans le Netlify Dashboard, allez dans **Functions**
   - Cliquez sur `create-checkout-session`
   - Vérifiez les logs pour voir les requêtes

## 🔄 Déploiements automatiques

Netlify déploie automatiquement à chaque push sur votre branche principale :

1. **Activer les déploiements automatiques**
   - Dans le Dashboard, allez dans **Site settings** > **Build & deploy**
   - Vérifiez que "Continuous Deployment" est activé
   - Configurez la branche de production (généralement `main` ou `master`)

2. **Déploiements de prévisualisation**
   - Chaque Pull Request crée automatiquement un déploiement de prévisualisation
   - Parfait pour tester avant de merger

## 🐛 Dépannage

### Erreur : "Function not found"

**Problème** : La fonction serverless n'est pas détectée.

**Solution** :
1. Vérifiez que le fichier est dans `netlify/functions/create-checkout-session.ts`
2. Vérifiez que `netlify.toml` contient la redirection `/api/*`
3. Redéployez : `netlify deploy --prod`

### Erreur : "STRIPE_SECRET_KEY is not configured"

**Problème** : La variable d'environnement n'est pas définie.

**Solution** :
1. Allez dans **Site settings** > **Environment variables**
2. Ajoutez `STRIPE_SECRET_KEY` avec votre clé
3. Redéployez le site

### Erreur : "Build failed"

**Problème** : Le build échoue.

**Solution** :
1. Vérifiez les logs de build dans le Dashboard
2. Testez localement : `npm run build`
3. Vérifiez que toutes les dépendances sont dans `package.json`

### Erreur CORS

**Problème** : Erreurs CORS lors des appels API.

**Solution** :
- La fonction Netlify inclut déjà les headers CORS
- Vérifiez que l'URL de votre site est correcte dans les redirections Stripe

## 📊 Monitoring et logs

### Voir les logs en temps réel

```bash
netlify functions:log
```

### Voir les logs d'une fonction spécifique

Dans le Dashboard :
1. Allez dans **Functions**
2. Cliquez sur `create-checkout-session`
3. Voir les logs en temps réel

## 🔒 Sécurité

### Bonnes pratiques

1. ✅ **Variables d'environnement** : Utilisez toujours les variables d'environnement pour les clés secrètes
2. ✅ **HTTPS** : Netlify fournit automatiquement HTTPS
3. ✅ **Secrets** : Ne commitez jamais les clés secrètes dans Git
4. ✅ **Webhooks Stripe** : Configurez les webhooks pour valider les paiements

### Configurer les webhooks Stripe

1. Allez sur [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Cliquez sur "Add endpoint"
3. URL : `https://votre-site.netlify.app/.netlify/functions/stripe-webhook`
4. Sélectionnez les événements : `checkout.session.completed`
5. Copiez le "Signing secret"
6. Ajoutez-le comme variable : `STRIPE_WEBHOOK_SECRET`

## 🚀 Déploiement en production

### Checklist avant la production

- [ ] Utiliser les clés Stripe **live** (`pk_live_...` et `sk_live_...`)
- Configurer un nom de domaine personnalisé
- Configurer les webhooks Stripe en production
- Tester tous les flux de paiement
- Vérifier que les emails de confirmation fonctionnent
- Configurer les analytics (optionnel)

### Changer pour les clés live

1. Obtenez vos clés live sur [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Mettez à jour les variables d'environnement dans Netlify
3. Redéployez

### Nom de domaine personnalisé

1. Dans le Dashboard, allez dans **Domain settings**
2. Cliquez sur **Add custom domain**
3. Suivez les instructions pour configurer votre DNS

## 📚 Ressources

- [Documentation Netlify](https://docs.netlify.com/)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Stripe Documentation](https://stripe.com/docs)
- [Netlify CLI Reference](https://cli.netlify.com/)

## 🆘 Support

Si vous rencontrez des problèmes :

1. Vérifiez les logs dans le Netlify Dashboard
2. Consultez la [documentation Netlify](https://docs.netlify.com/)
3. Contactez le support Netlify via le Dashboard

---

**Félicitations !** Votre site Aura Microlocs est maintenant prêt à être déployé sur Netlify. 🎉
