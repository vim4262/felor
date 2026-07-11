/* ============================================================
   ANALYTICS MINIMALISTES & PRIVACY-FRIENDLY
   Utilise Plausible Analytics (privacy-friendly, sans cookies)
   Alternative: Google Analytics 4
   ============================================================ */

'use strict';

class PortfolioAnalytics {
  constructor() {
    this.enabled = true;
    this.plausibleDomain = 'portfolio-ekoe-s4.vercel.app'; // Remplacer par votre domaine
    this.init();
  }

  init() {
    // Charger Plausible Analytics si activé
    if (this.enabled && this.plausibleDomain) {
      this.loadPlausible();
    }

    // Tracking des événements personnalisés
    this.trackCustomEvents();
  }

  loadPlausible() {
    const script = document.createElement('script');
    script.defer = true;
    script.dataset.domain = this.plausibleDomain;
    script.src = 'https://plausible.io/js/script.js';
    document.head.appendChild(script);
  }

  trackCustomEvents() {
    // Tracking des clics sur les liens sociaux
    document.querySelectorAll('.social-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const platform = btn.classList.contains('site-linkedin') ? 'linkedin' :
                        btn.classList.contains('site-github') ? 'github' : 'email';
        this.trackEvent('social_click', { platform });
      });
    });

    // Tracking des téléchargements de fichiers
    document.querySelectorAll('a[href$=".pdf"], a[href$=".zip"], a[href$=".doc"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const file = link.getAttribute('href');
        this.trackEvent('file_download', { file });
      });
    });

    // Tracking des soumissions de formulaire
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', () => {
        this.trackEvent('form_submit', { form: 'contact' });
      });
    }

    // Tracking du temps de lecture (estimé)
    this.trackReadingTime();
  }

  trackEvent(eventName, props = {}) {
    if (typeof window.plausible !== 'undefined') {
      window.plausible(eventName, { props });
    }
    console.log('[Analytics]', eventName, props);
  }

  trackReadingTime() {
    const startTime = Date.now();
    let trackingSent = false;

    window.addEventListener('beforeunload', () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      if (timeSpent > 30 && !trackingSent) { // Plus de 30 secondes
        this.trackEvent('page_engagement', { 
          time_spent: timeSpent,
          page: window.location.pathname 
        });
        trackingSent = true;
      }
    });
  }

  // Tracking des performances de chargement
  trackPerformance() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const loadTime = entry.loadEventEnd - entry.fetchStart;
            this.trackEvent('page_load', { 
              load_time: Math.round(loadTime),
              page: window.location.pathname 
            });
          }
        });
      });
      observer.observe({ entryTypes: ['navigation'] });
    }
  }
}

// Initialiser les analytics
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new PortfolioAnalytics();
  });
} else {
  new PortfolioAnalytics();
}