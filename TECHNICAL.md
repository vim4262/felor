# Documentation Technique - Portfolio EKOE-S4-2026

## 📋 Table des matières

1. [Structure du projet](#structure-du-projet)
2. [Technologies utilisées](#technologies-utilisées)
3. [Installation et développement](#installation-et-développement)
4. [Configuration](#configuration)
5. [Personnalisation](#personnalisation)
6. [Fonctionnalités](#fonctionnalités)
7. [Déploiement](#déploiement)
8. [Performance et optimisation](#performance-et-optimisation)
9. [Accessibilité](#accessibilité)
10. [Sécurité](#sécurité)
11. [Maintenance](#maintenance)

---

## 🏗️ Structure du projet

```
portfolio-ekoe-s4/
├── assets/
│   ├── favicon.svg
│   └── images/
│       ├── profile/          # Photos de profil
│       ├── projects/        # Captures d'écran projets
│       └── README.md        # Instructions images
├── data.json                 # Données dynamiques (UE, projets)
├── index.html                # Page d'accueil
├── competences.html          # Page compétences
├── projets.html              # Page projets
├── parcours.html             # Page parcours
├── contact.html              # Page contact
├── admin.html                # Dashboard admin
├── 404.html                  # Page erreur
├── styles-variables.css      # Design system (couleurs, typo, espacements)
├── styles-base.css           # Reset & styles globaux
├── styles-components.css     # Boutons, cartes, badges, formulaires
├── styles-navigation.css     # Navigation et header
├── styles-main.css           # Import des modules + hero + animations
├── styles-competences.css    # Styles page compétences
├── styles-projets.css        # Styles page projets
├── styles-parcours.css       # Styles page parcours
├── styles-contact.css        # Styles page contact
├── main.js                   # JavaScript principal
├── config.js                 # Configuration globale
├── form-validation.js       # Validation formulaire
├── analytics.js              # Analytics minimalistes
├── sw.js                     # Service Worker
├── package.json              # Configuration npm
├── README.md                 # Documentation utilisateur
├── TECHNICAL.md              # Documentation technique
├── sitemap.xml               # Sitemap SEO
├── robots.txt                # Robots SEO
└── _redirects                # Redirections Netlify
```

---

## 🛠️ Technologies utilisées

### Frontend
- **HTML5** : Structure sémantique
- **CSS3** : Variables CSS, Grid, Flexbox, Animations
- **JavaScript (ES6+)** : Vanilla JS, Classes, Async/Await
- **Iconify** : Icônes Lucide

### Outils
- **Service Worker** : Cache et performance
- **Formspree** : Formulaire de contact (optionnel)
- **Plausible Analytics** : Analytics privacy-friendly (optionnel)

### Développement
- **Python** : Serveur de développement local
- **Netlify/Vercel** : Déploiement
- **Git** : Versioning

---

## 💻 Installation et développement

### Prérequis
- Node.js 16+ (optionnel)
- Python 3+ (pour serveur local)
- Git

### Installation locale

```bash
# Cloner le repository
git clone https://github.com/ekoe-felicio/portfolio-ekoe-s4.git
cd portfolio-ekoe-s4

# Optionnel: Installer les dépendances
npm install
```

### Lancer le serveur de développement

```bash
# Avec Python (recommandé)
python -m http.server 8080

# Ou avec npm
npm run dev

# Ou avec npx serve
npx serve .
```

Ouvrir `http://localhost:8080` dans le navigateur.

---

## ⚙️ Configuration

### Fichier `config.js`

Modifier les coordonnées personnelles :

```javascript
window.SITE = {
  name: 'EKOE Félicio',
  ref: 'EKOE-S4-2026',
  email: 'ekoe.felicio@esig-portfolio.tg',
  phone: '+22890000000',
  phoneDisplay: '+228 90 00 00 00',
  location: 'Lomé, Togo',
  school: 'ESIG Global Success',
  linkedin: 'https://www.linkedin.com/in/ekoe-felicio',
  github: 'https://github.com/ekoe-felicio',
  portfolioS3: 'https://sites.google.com/view/portfoliode2024-2025/accueil'
};
```

### Fichier `data.json`

Modifier les données des UE et projets :

```json
{
  "ues": [
    {
      "code": "INF 1492",
      "title": "Circuits numériques",
      "credits": 4,
      ...
    }
  ],
  "projects": [...],
  "timeline": [...]
}
```

---

## 🎨 Personnalisation

### Images

1. Placer vos images dans les dossiers appropriés :
   - `assets/images/profile/profile.jpg` (420x480px)
   - `assets/images/projects/fortigate-lab.jpg` (600x400px)
   - etc.

2. Remplacer les URLs `picsum.photos` dans les fichiers HTML :

```html
<!-- Avant -->
<img src="https://picsum.photos/seed/fortigate-gns3-lab-sae/600/400" alt="">

<!-- Après -->
<img src="assets/images/projects/fortigate-lab.jpg" alt="">
```

### Couleurs

Modifier les variables CSS dans `styles-variables.css` :

```css
:root {
  --ink:     #2E5BFF;      /* Couleur principale (encre) */
  --accent:  #F2A93B;      /* Accentuation — "pièce à conviction" */
  --bg:      #0A0D16;      /* Fond */
  /* ... */
}
```

### Typographie

Changer les polices dans les variables CSS :

```css
:root {
  --display: 'Archivo Black', 'Archivo', sans-serif;
  --head:    'Archivo', sans-serif;
  --sans:    'Space Grotesk', sans-serif;
  --mono:    'JetBrains Mono', monospace;
}
```

---

## 🚀 Fonctionnalités

### 1. Système de design cohérent
- Variables CSS pour couleurs, typographie, espacements
- Composants réutilisables (cards, buttons, forms)
- Animations fluides et performantes

### 2. Animations optimisées
- Réseau de particules interactif (canvas)
- Animations au scroll (IntersectionObserver)
- Effets de hover et transitions
- Respect de `prefers-reduced-motion`

### 3. Formulaire de contact
- Validation côté client robuste
- Messages d'erreur clairs
- Support pour Formspree ou mailto
- Accessibilité ARIA

### 4. Service Worker
- Cache des assets statiques
- Stratégie Cache First / Network First
- Support offline
- Mise à jour automatique

### 5. Analytics minimalistes
- Tracking des événements personnalisés
- Respect de la vie privée (Plausible)
- Performance tracking
- Pas de cookies tracking

### 6. Accessibilité
- Navigation clavier complète
- Attributs ARIA appropriés
- Contrastes WCAG AA
- Skip links
- Focus visible

### 7. SEO
- Meta tags optimisés
- Sitemap.xml
- Robots.txt
- Open Graph tags
- Structure sémantique

---

## 🌐 Déploiement

### Netlify

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Déployer
netlify deploy --prod

# Ou glisser-déposer le dossier sur app.netlify.com/drop
```

### Vercel

```bash
# Installer Vercel CLI
npm install -g vercel

# Déployer
vercel --prod
```

### GitHub Pages

```bash
# Pusher sur GitHub
git add .
git commit -m "Déploiement portfolio"
git push origin main

# Activer Pages dans les settings du repository
```

### Configuration Netlify (`_redirects`)

```
# Redirections
/*  /index.html  404
```

---

## ⚡ Performance et optimisation

### Optimisations actuelles
- **Images** : Lazy loading, attribut `loading="lazy"`
- **JavaScript** : Chargement différé (`defer`)
- **CSS** : Variables CSS, animations optimisées
- **Service Worker** : Cache des assets
- **Particules** : Nombre réduit pour performance

### Scores Lighthouse cibles
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 100

### Optimisations futures
- Compression des images (WebP)
- Minification CSS/JS
- CDN pour les assets
- Préchargement des polices

---

## ♿ Accessibilité

### Conformité WCAG 2.1 AA

#### Couleurs et contrastes
- Ratio de contraste minimum 4.5:1 pour le texte
- Ratio de contraste minimum 3:1 pour les grands textes
- Indicateurs de focus visibles

#### Navigation
- Navigation au clavier complète
- Skip links fonctionnels
- Ordre de focus logique
- Labels ARIA appropriés

#### Contenu
- Texte alternatif pour les images
- Structure sémantique HTML5
- headings hiérarchiques
- Lists pour les regroupements

#### Multimédia
- Pas de contenu qui clignote
- Contrôle des animations
- `prefers-reduced-motion` respecté

---

## 🔒 Sécurité

### Mesures de sécurité actuelles
- **Content Security Policy** : À configurer
- **HTTPS** : Activé en production
- **Input validation** : Validation côté client
- **XSS Protection** : Headers de sécurité
- **No sensitive data** : Pas de données sensibles exposées

### Headers de sécurité recommandés

```http
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.iconify.design; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

---

## 🔧 Maintenance

### Mises à jour régulières

#### Contenu
- Mettre à jour `data.json` avec nouvelles UE/projets
- Ajouter nouvelles images dans `assets/images/`
- Mettre à jour `config.js` si changements coordonnées

#### Dépendances
- Mettre à jour `package.json` si nouvelles dépendances
- Vérifier les liens externes (Iconify, Google Fonts)

#### Analytics
- Surveiller les stats Plausible
- Analyser les performances
- Identifier les pages populaires

### Dépannage

#### Le formulaire ne fonctionne pas
- Vérifier la configuration `config.js`
- Tester avec mailto par défaut
- Configurer Formspree si besoin

#### Le service worker ne s'installe pas
- Vérifier que le site est en HTTPS
- Nettoyer le cache du navigateur
- Vérifier la console pour erreurs

#### Les images ne s'affichent pas
- Vérifier les chemins dans `data.json`
- S'assurer que les fichiers existent
- Vérifier les permissions de fichiers

---

## 📚 Ressources utiles

### Documentation
- [MDN Web Docs](https://developer.mozilla.org/)
- [CSS Tricks](https://css-tricks.com/)
- [Web.dev](https://web.dev/)

### Outils
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [axe DevTools](https://www.deque.com/axe/)
- [PageSpeed Insights](https://pagespeed.web.dev/)

### Inspiration
- [Awwwards](https://www.awwwards.com/)
- [CSS Design Awards](https://www.cssdesignawards.com/)
- [Dribbble](https://dribbble.com/)

---

## 🤝 Contribution

Pour contribuer à ce projet :

1. Fork le repository
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier LICENSE pour plus de détails.

---

## 👤 Auteur

**EKOE Félicio**
- Portfolio: [https://portfolio-ekoe-s4.vercel.app](https://portfolio-ekoe-s4.vercel.app)
- Email: ekoe.felicio@esig-portfolio.tg
- LinkedIn: [https://www.linkedin.com/in/ekoe-felicio](https://www.linkedin.com/in/ekoe-felicio)
- GitHub: [https://github.com/ekoe-felicio](https://github.com/ekoe-felicio)

---

**Dernière mise à jour**: 2026-07-09