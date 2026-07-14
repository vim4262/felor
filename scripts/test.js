/* ============================================================
   SCRIPT DE TEST - Vérification des modifications
   ============================================================ */

const fs = require('fs');
const path = require('path');

console.log('🧪 Test des modifications du portfolio...\n');

// Tests à effectuer
const tests = [
  {
    name: 'Vérification structure dossiers images',
    test: () => {
      const profileDir = path.join(__dirname, '..', 'assets/images/profile');
      const projectsDir = path.join(__dirname, '..', 'assets/images/projects');
      return fs.existsSync(profileDir) && fs.existsSync(projectsDir);
    }
  },
  {
    name: 'Vérification package.json',
    test: () => {
      const packageJson = path.join(__dirname, '..', 'package.json');
      return fs.existsSync(packageJson);
    }
  },
  {
    name: 'Vérification data.json',
    test: () => {
      const dataJson = path.join(__dirname, '..', 'data.json');
      if (!fs.existsSync(dataJson)) return false;
      
      const data = JSON.parse(fs.readFileSync(dataJson, 'utf8'));
      return data.ues && data.projects && data.timeline;
    }
  },
  {
    name: 'Vérification form-validation.js',
    test: () => {
      const formValidation = path.join(__dirname, '..', 'form-validation.js');
      return fs.existsSync(formValidation);
    }
  },
  {
    name: 'Vérification analytics.js',
    test: () => {
      const analytics = path.join(__dirname, '..', 'analytics.js');
      return fs.existsSync(analytics);
    }
  },
  {
    name: 'Vérification sw.js',
    test: () => {
      const sw = path.join(__dirname, '..', 'sw.js');
      return fs.existsSync(sw);
    }
  },
  {
    name: 'Vérification CSS modulaire',
    test: () => {
      const cssFiles = [
        'styles-variables.css',
        'styles-base.css',
        'styles-components.css',
        'styles-navigation.css',
        'styles-main.css',
        'styles-competences.css',
        'styles-projets.css',
        'styles-parcours.css',
        'styles-contact.css'
      ];
      
      return cssFiles.every(file => fs.existsSync(path.join(__dirname, '..', file)));
    }
  },
  {
    name: 'Vérification configuration HTML',
    test: () => {
      const indexHtml = path.join(__dirname, '..', 'index.html');
      const content = fs.readFileSync(indexHtml, 'utf8');
      
      return content.includes('styles-main.css') && 
             content.includes('sw.js') &&
             content.includes('analytics.js');
    }
  },
  {
    name: 'Vérification documentation technique',
    test: () => {
      const technicalDoc = path.join(__dirname, '..', 'TECHNICAL.md');
      return fs.existsSync(technicalDoc);
    }
  }
];

// Exécuter les tests
let passed = 0;
let failed = 0;

tests.forEach((test, index) => {
  try {
    const result = test.test();
    if (result) {
      console.log(`✅ Test ${index + 1}: ${test.name}`);
      passed++;
    } else {
      console.log(`❌ Test ${index + 1}: ${test.name}`);
      failed++;
    }
  } catch (error) {
    console.log(`❌ Test ${index + 1}: ${test.name} - Erreur: ${error.message}`);
    failed++;
  }
});

// Résumé
console.log('\n📊 Résumé des tests:');
console.log(`✅ Réussis: ${passed}/${tests.length}`);
console.log(`❌ Échoués: ${failed}/${tests.length}`);

if (failed === 0) {
  console.log('\n🎉 Tous les tests sont passés !');
  process.exit(0);
} else {
  console.log('\n⚠️ Certains tests ont échoué. Veuillez vérifier les erreurs ci-dessus.');
  process.exit(1);
}