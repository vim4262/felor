/* ============================================================
   SCRIPT DE BUILD - Préparation pour déploiement
   ============================================================ */

const fs = require('fs');
const path = require('path');

console.log('🔨 Build du portfolio...\n');

// Fonction pour copier un fichier
function copyFile(source, dest) {
  const destDir = path.dirname(dest);
  
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  fs.copyFileSync(source, dest);
  console.log(`📄 Copié: ${path.basename(source)}`);
}

// Fonction pour créer le dossier dist
function createDist() {
  const distPath = path.join(__dirname, '../dist');
  
  if (fs.existsSync(distPath)) {
    fs.rmSync(distPath, { recursive: true, force: true });
  }
  
  fs.mkdirSync(distPath, { recursive: true });
  console.log('📁 Dossier dist créé');
}

// Copier les fichiers nécessaires
function buildProject() {
  const distPath = path.join(__dirname, '../dist');
  const rootPath = path.join(__dirname, '..');
  
  // Fichiers à copier
  const filesToCopy = [
    'index.html',
    'competences.html',
    'projets.html',
    'parcours.html',
    'contact.html',
    'admin.html',
    '404.html',
    'style.css', // Garder l'ancien fichier pour compatibilité
    'styles-variables.css',
    'styles-base.css',
    'styles-components.css',
    'styles-navigation.css',
    'styles-main.css',
    'styles-competences.css',
    'styles-projets.css',
    'styles-parcours.css',
    'styles-contact.css',
    'main.js',
    'config.js',
    'form-validation.js',
    'analytics.js',
    'sw.js',
    'data.json',
    'package.json',
    'README.md',
    'TECHNICAL.md',
    'sitemap.xml',
    'robots.txt',
    '_redirects'
  ];
  
  // Copier les fichiers HTML
  filesToCopy.forEach(file => {
    const source = path.join(rootPath, file);
    const dest = path.join(distPath, file);
    
    if (fs.existsSync(source)) {
      copyFile(source, dest);
    } else {
      console.log(`⚠️ Fichier manquant: ${file}`);
    }
  });
  
  // Copier le dossier assets
  const assetsSource = path.join(rootPath, 'assets');
  const assetsDest = path.join(distPath, 'assets');
  
  if (fs.existsSync(assetsSource)) {
    copyDirectory(assetsSource, assetsDest);
  }
  
  console.log('\n✅ Build terminé avec succès !');
  console.log(`📦 Dossier dist: ${distPath}`);
}

// Fonction pour copier un dossier récursivement
function copyDirectory(source, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(source, { withFileTypes: true });
  
  entries.forEach(entry => {
    const sourcePath = path.join(source, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDirectory(sourcePath, destPath);
    } else {
      copyFile(sourcePath, destPath);
    }
  });
  
  console.log(`📁 Dossier copié: ${path.basename(source)}`);
}

// Exécuter le build
try {
  createDist();
  buildProject();
} catch (error) {
  console.error('❌ Erreur lors du build:', error);
  process.exit(1);
}