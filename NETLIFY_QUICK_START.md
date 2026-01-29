# 🚀 Guide Rapide Netlify - 5 minutes

## Méthode 1 : Interface Web (Le plus simple)

### Étape 1 : Préparer votre code
```bash
# Assurez-vous que votre code est sur GitHub/GitLab/Bitbucket
git add .
git commit -m "Ready for Netlify"
git push
```

### Étape 2 : Connecter à Netlify
1. Allez sur [netlify.com](https://www.netlify.com) et connectez-vous
2. Cliquez sur **"Add new site"** > **"Import an existing project"**
3. Connectez votre dépôt Git
4. Sélectionnez votre dépôt

### Étape 3 : Configurer le build
- **Build command** : `npm run build`
- **Publish directory** : `dist`
- Cliquez sur **"Show advanced"** avant de déployer

### Étape 4 : Ajouter les variables d'environnement
Cliquez sur **"New variable"** et ajoutez :

```
   GEMINI_API_KEY = your_gemini_api_key_here
   VITE_STRIPE_PUBLISHABLE_KEY = pk_test_your_publishable_key_here
   STRIPE_SECRET_KEY = sk_test_your_secret_key_here

### Étape 5 : Déployer
Cliquez sur **"Deploy site"** et attendez 2-5 minutes.

✅ **C'est tout !** Votre site est en ligne.

---

## Méthode 2 : CLI (Pour développeurs)

### Installation
```bash
npm install -g netlify-cli
```

### Connexion
```bash
netlify login
```

### Initialisation
```bash
netlify init
```

### Variables d'environnement
```bash
netlify env:set GEMINI_API_KEY "your_gemini_api_key"
netlify env:set VITE_STRIPE_PUBLISHABLE_KEY "pk_test_your_publishable_key"
netlify env:set STRIPE_SECRET_KEY "sk_test_your_secret_key"
```

### Déploiement
```bash
netlify deploy --prod
```

---

## ✅ Vérification

1. Visitez votre URL Netlify (ex: `https://votre-site.netlify.app`)
2. Testez un paiement avec la carte : `4242 4242 4242 4242`
3. Vérifiez les logs dans **Functions** > `create-checkout-session`

---

## 📚 Guide complet

Pour plus de détails, consultez `NETLIFY_DEPLOY.md`
