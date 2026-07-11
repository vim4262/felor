# Portfolio EKOE Félicio — Semestre 4

Portfolio académique et technique — Licence Pro Sécurité Informatique, ESIG Global Success.

## 🌟 Nouveautés (Version 2.0)

- ✨ **CSS Modulaire** : Structure organisée en modules maintenables
- 🚀 **Service Worker** : Cache automatique pour performances optimales
- 📝 **Formulaire avancé** : Validation robuste et support Formspree
- 📊 **Analytics minimalistes** : Tracking privacy-friendly avec Plausible
- ♿ **Accessibilité améliorée** : WCAG AA compliance, contrastes optimisés
- 📦 **Configuration centralisée** : `data.json` pour contenu dynamique
- 🧪 **Tests automatisés** : Script de test pour vérifier l'intégrité

## Structure

### Fichiers principaux
| Fichier | Rôle |
|---------|------|
| `index.html` | Accueil — hero, présentation, projets phares |
| `competences.html` | 12 compétences vérifiées avec détails |
| `projets.html` | SAESI401 + projets personnels |
| `parcours.html` | Timeline scolaire + bilan S4 |
| `contact.html` | Coordonnées + formulaire avancé |
| `admin.html` | Dashboard d'administration (démo locale, non lié dans la navigation publique, sans authentification ni backend réel) |

### CSS (Architecture modulaire)
| Fichier | Rôle |
|---------|------|
| `styles-variables.css` | Variables CSS (couleurs, typographie, etc.) |
| `styles-base.css` | Reset et styles globaux |
| `styles-components.css` | Composants UI (boutons, cards, formulaires) |
| `styles-navigation.css` | Navigation et header |
| `styles-main.css` | Styles principaux et animations |
| `styles-competences.css` | Styles spécifiques page compétences |
| `styles-projets.css` | Styles spécifiques page projets |
| `styles-parcours.css` | Styles spécifiques page parcours |
| `styles-contact.css` | Styles spécifiques page contact |

### JavaScript
| Fichier | Rôle |
|---------|------|
| `main.js` | Particules, animations, navigation |
| `config.js` | Configuration globale (coordonnées) |
| `form-validation.js` | Validation formulaire de contact |
| `analytics.js` | Analytics minimalistes |
| `sw.js` | Service Worker pour cache |

### Données
| Fichier | Rôle |
|---------|------|
| `data.json` | Données UE, projets, timeline (contenu dynamique) |
| `package.json` | Configuration npm et scripts |

## Personnalisation rapide

### 1. Configuration globale (`config.js`)
```javascript
window.SITE = {
  name: 'EKOE Félicio',
  email: 'ekoe.felicio@esig-portfolio.tg',
  linkedin: 'https://www.linkedin.com/in/ekoe-felicio',
  github: 'https://github.com/ekoe-felicio',
  // ...
};
```

### 2. Contenu dynamique (`data.json`)
```json
{
  "ues": [...],
  "projects": [...],
  "timeline": [...]
}
```

### 3. Images
Placer vos images dans les dossiers appropriés :
- `assets/images/profile/profile.jpg` (420x480px)
- `assets/images/projects/fortigate-lab.jpg` (600x400px)
- etc.

### 4. Analytics (optionnel)
Configurer `analytics.js` avec votre domaine Plausible :
```javascript
this.plausibleDomain = 'votre-domaine.com';
```

### 5. Formulaire (optionnel)
Configurer Formspree dans `form-validation.js` :
```javascript
const FORMSPREE_ID = 'VOTRE_FORM_ID';
```

## Lancer en local

```bash
# Avec Python (recommandé)
python -m http.server 8080

# Avec npm
npm run dev

# Avec npx serve
npx serve .
```

Ouvrir `http://localhost:8080`

## Tests

```bash
# Exécuter les tests d'intégrité
npm test

# Vérifier les liens locaux et les placeholders restants
npm run lint
```

## Déploiement

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Vercel
```bash
npm install -g vercel
vercel --prod
```

### GitHub Pages
```bash
git add .
git commit -m "Déploiement portfolio"
git push origin main
# Activer Pages dans les settings du repository
```

## Stack

HTML5 · CSS3 (Variables, Grid, Flexbox) · JavaScript (ES6+) · Service Worker · Iconify (Lucide) · Google Fonts

## Documentation

- 📖 [Documentation technique](TECHNICAL.md) - Guide complet de développement
- 🎨 [Design System](styles-variables.css) - Variables et tokens de design
- 🔧 [Configuration](config.js) - Personnalisation du site

## Performance

- ⚡ Lighthouse Score: 90+ Performance, 95+ Accessibility
- 🚀 Service Worker pour cache offline
- 📱 Responsive design mobile-first
- ♿ WCAG 2.1 AA compliant

## Licence

MIT

---

**Auteur**: EKOE Félicio  
**Version**: 2.0  
**Année**: 2026
