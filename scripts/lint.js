/* ============================================================
   SCRIPT DE LINT - Vérifie les liens locaux et les placeholders
   ============================================================ */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const HTML_FILES = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));

console.log('🔍 Lint du portfolio...\n');

let errors = 0;
let warnings = 0;

// 1) Vérifier que les ressources locales référencées (href/src) existent bien
const refRegex = /(?:href|src)="([^"]+)"/g;

HTML_FILES.forEach((file) => {
  const content = fs.readFileSync(path.join(ROOT, file), 'utf8');
  let match;
  while ((match = refRegex.exec(content)) !== null) {
    const ref = match[1];

    // On ignore les URLs externes, ancres et protocoles spéciaux
    if (
      ref.startsWith('http://') ||
      ref.startsWith('https://') ||
      ref.startsWith('//') ||
      ref.startsWith('#') ||
      ref.startsWith('mailto:') ||
      ref.startsWith('tel:')
    ) {
      continue;
    }

    const cleanRef = ref.split('#')[0].split('?')[0];
    if (!cleanRef) continue;

    const resolved = path.join(ROOT, cleanRef);
    if (!fs.existsSync(resolved)) {
      console.log(`❌ ${file}: lien local cassé -> "${ref}"`);
      errors++;
    }
  }
});

if (errors === 0) {
  console.log('✅ Aucun lien local cassé détecté.\n');
}

// 2) Repérer les placeholders manifestement non configurés
const PLACEHOLDER_CHECKS = [
  { file: 'form-validation.js', pattern: /YOUR_FORM_ID/, message: 'FORMSPREE_ID non configuré (toujours "YOUR_FORM_ID")' },
  { file: 'analytics.js', pattern: /vercel\.app/, message: 'plausibleDomain semble être un domaine par défaut (vercel.app)' },
  { file: 'config.js', pattern: /esig-portfolio\.tg/, message: 'email de contact semble être un placeholder (@esig-portfolio.tg)' },
  { file: 'config.js', pattern: /\+22890000000/, message: 'numéro de téléphone semble être un placeholder' },
];

PLACEHOLDER_CHECKS.forEach(({ file, pattern, message }) => {
  const filePath = path.join(ROOT, file);
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  if (pattern.test(content)) {
    console.log(`⚠️  ${file}: ${message}`);
    warnings++;
  }
});

// 3) Repérer les images placeholder (picsum.photos) restantes
HTML_FILES.forEach((file) => {
  const content = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const count = (content.match(/picsum\.photos/g) || []).length;
  if (count > 0) {
    console.log(`⚠️  ${file}: ${count} image(s) placeholder picsum.photos à remplacer par de vrais visuels`);
    warnings++;
  }
});

console.log(`\n📊 Résumé: ${errors} erreur(s), ${warnings} avertissement(s).`);

if (errors > 0) {
  console.log('\n⚠️ Des liens locaux sont cassés, merci de corriger avant déploiement.');
  process.exit(1);
} else {
  console.log('\n🎉 Lint terminé sans erreur bloquante (les avertissements restent à traiter manuellement).');
  process.exit(0);
}
