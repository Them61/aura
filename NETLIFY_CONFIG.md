# Configuration Netlify - Champs à remplir

## 📝 Configuration lors de l'import du projet

Lorsque vous importez votre projet sur Netlify, voici ce que vous devez mettre dans chaque champ :

### Branch to deploy
**Valeur :** `main` (ou `master`)

**Explication :** 
- C'est la branche Git qui sera utilisée pour les déploiements
- Si votre branche principale s'appelle `main`, mettez `main`
- Si votre branche principale s'appelle `master`, mettez `master`
- Vous pouvez vérifier votre branche principale avec : `git branch`

### Base directory
**Valeur :** Laissez **vide** (ou `/`)

**Explication :**
- Laissez vide si votre projet est à la racine du dépôt Git
- Ne remplissez que si votre projet est dans un sous-dossier (ex: `frontend/`, `app/`)
- Dans votre cas, laissez vide car votre projet est à la racine

### Build command
**Valeur :** `npm run build`

**Explication :**
- C'est la commande qui construit votre application
- Netlify exécutera cette commande lors du déploiement

### Publish directory
**Valeur :** `dist`

**Explication :**
- C'est le dossier contenant les fichiers statiques après le build
- Vite génère les fichiers dans le dossier `dist` par défaut

## ✅ Configuration complète recommandée

```
Branch to deploy:     main
Base directory:       (vide)
Build command:        npm run build
Publish directory:    dist
```

## 🔍 Comment vérifier votre branche principale

```bash
# Voir toutes les branches
git branch

# Voir la branche actuelle (marquée d'un *)
git branch --show-current

# Voir la branche par défaut
git symbolic-ref refs/remotes/origin/HEAD
```

## 📋 Checklist avant de déployer

- [ ] Votre code est poussé sur GitHub/GitLab/Bitbucket
- [ ] Vous connaissez le nom de votre branche principale (`main` ou `master`)
- [ ] Vous avez préparé vos variables d'environnement
- [ ] Vous avez testé `npm run build` localement

## 🆘 Si vous n'êtes pas sûr

**Pour Branch to deploy :**
- Regardez sur GitHub/GitLab : la branche principale est généralement affichée en premier
- Ou utilisez `main` par défaut (c'est le standard moderne)

**Pour Base directory :**
- Si vous n'êtes pas sûr, laissez vide
- Si votre projet ne fonctionne pas après déploiement, vérifiez si vous avez un sous-dossier
