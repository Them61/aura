# 🚀 Démarrage Rapide - API Routes Stripe

## Installation des dépendances

```bash
npm install
```

## Configuration

1. **Ajoutez votre clé secrète Stripe** dans `.env.local` :
   ```env
   STRIPE_SECRET_KEY=sk_test_votre_cle_secrete_ici
   ```

2. **Vérifiez que votre clé publique est configurée** (déjà fait) :
   ```env
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51QXoODBQo6w9DkqTUqLbEeakbzMLwWhCeux3X0deRQMHUG4nbGSqGQh8Qargc8wtgLxjAEUU3bkQt4GhcD9dDMcm00ARo1aVuo
   ```

## Développement local

### Option 1 : Deux terminaux séparés

**Terminal 1** - Serveur API :
```bash
npm run dev:server
```

**Terminal 2** - Frontend :
```bash
npm run dev
```

### Option 2 : Un seul terminal (recommandé)

```bash
npm run dev:all
```

Cette commande démarre automatiquement le serveur API (port 3001) et le frontend (port 3000).

## Tester

1. Ouvrez `http://localhost:3000`
2. Allez sur `/services` et ajoutez un produit au panier
3. Cliquez sur "Acheter maintenant" ou allez au checkout
4. Remplissez le formulaire et testez avec la carte : `4242 4242 4242 4242`

## Déploiement

### Vercel (Recommandé)
```bash
vercel
```
Configurez `STRIPE_SECRET_KEY` dans le dashboard Vercel.

### Netlify
```bash
netlify deploy --prod
```
Configurez `STRIPE_SECRET_KEY` dans le dashboard Netlify.

## 📚 Documentation complète

- `API_SETUP.md` - Guide complet de configuration
- `STRIPE_SETUP.md` - Documentation Stripe détaillée
