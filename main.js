/* ============================================================
   PORTFOLIO EKOE-S4-2026 — main.js (version améliorée)
   Améliorations : accessibilité, UX, robustesse, SEO-friendly
   ============================================================ */

'use strict';

// ============ SERVICE WORKER REGISTRATION ============
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then((registration) => {
        console.log('[SW] Enregistré avec succès:', registration.scope);
      })
      .catch((error) => {
        console.log('[SW] Échec de l\'enregistrement:', error);
      });
  });
}

// ============ RÉSEAU DE PARTICULES OPTIMISÉ (canvas) ============
try {
  const canvas = document.getElementById('particles');
  if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = canvas.getContext('2d');
    let W, H, pts = [];

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Réduction drastique du nombre de particules pour la performance
    const COUNT = window.innerWidth < 768
      ? Math.min(15, Math.floor(window.innerWidth / 40))
      : Math.min(35, Math.floor(window.innerWidth / 30));
    
    for (let i = 0; i < COUNT; i++) {
      pts.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.2 + 0.6
      });
    }

    let mx = -999, my = -999;
    document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });

    function frame() {
      ctx.clearRect(0, 0, W, H);
      
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

        const dx = p.x - mx, dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          p.x += dx * 0.005;
          p.y += dy * 0.005;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(59,130,246,0.4)';
        ctx.fill();
      }

      // Connexions simplifiées avec distance réduite
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(59,130,246,${0.08 * (1 - d / 100)})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
} catch (err) { console.error('Particles:', err); }

// ============ CURSEUR LUMINEUX (DÉSACTIVÉ POUR PERFORMANCE) ============
/* Désactivé pour améliorer les performances */

// ============ TERMINAL TYPEWRITER ============
try {
  const tw = document.getElementById('typewriter');
  if (tw) {
    const phrases = [
      ' durcissement réseau',
      ' admin. Windows & Linux',
      ' cryptanalyse CTF',
      ' lab GNS3 / FortiGate',
      ' forensique & traces SI'
    ];
    let pi = 0, ci = 0, deleting = false;

    function typeTick() {
      const phrase = phrases[pi];
      if (!deleting) {
        tw.textContent = phrase.slice(0, ++ci);
        if (ci === phrase.length) {
          deleting = true;
          setTimeout(typeTick, 2200);
          return;
        }
        setTimeout(typeTick, 55 + Math.random() * 40);
      } else {
        tw.textContent = phrase.slice(0, --ci);
        if (ci === 0) {
          deleting = false;
          pi = (pi + 1) % phrases.length;
          setTimeout(typeTick, 400);
          return;
        }
        setTimeout(typeTick, 30);
      }
    }
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTimeout(typeTick, 800);
    } else {
      tw.textContent = phrases[0];
    }
  }
} catch (err) { console.error('Typewriter:', err); }

// ============ CONFIG SITE (config.js) ============
function applySiteConfig() {
  const s = window.SITE;
  if (!s) return;

  document.querySelectorAll('.site-email').forEach(el => {
    el.href = 'mailto:' + s.email;
  });
  document.querySelectorAll('.site-email-text').forEach(el => {
    el.textContent = s.email;
  });
  document.querySelectorAll('.site-phone').forEach(el => {
    el.href = 'tel:' + s.phone.replace(/\s/g, '');
    if (!el.querySelector('iconify-icon')) el.textContent = s.phoneDisplay;
  });
  document.querySelectorAll('.site-linkedin').forEach(el => {
    if (s.linkedin) { el.href = s.linkedin; el.target = '_blank'; el.rel = 'noopener'; }
    else el.classList.add('hidden');
  });
  document.querySelectorAll('.site-github').forEach(el => {
    if (s.github) { el.href = s.github; el.target = '_blank'; el.rel = 'noopener'; }
    else el.classList.add('hidden');
  });
  document.querySelectorAll('.site-portfolio-s3').forEach(el => {
    if (s.portfolioS3) el.href = s.portfolioS3;
  });
}
applySiteConfig();

// ============ NAV ACTIVE (aria-current) ============
try {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.tab-row a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.setAttribute('aria-current', 'page');
    }
  });
} catch (err) { /* non critique */ }

// ============ ANIMATIONS DE SCROLL OPTIMISÉES ============
try {
  const observerOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px -30px 0px'
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Arrêter d'observer une fois animé pour la performance
        scrollObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observer uniquement les éléments visibles
  // (.fade-up est géré séparément plus bas, avec délai en cascade —
  // on évite de l'observer deux fois avec deux IntersectionObserver)
  document.querySelectorAll('.fade-in, .scale-in, .slide-left, .slide-right, .zoom-in').forEach(el => {
    scrollObserver.observe(el);
  });

} catch (err) { console.error('Scroll animations:', err); }

// ============ SCROLL TO TOP ============
try {
  let scrollBtn = document.getElementById('scrollTop');
  if (!scrollBtn) {
    scrollBtn = document.createElement('button');
    scrollBtn.id = 'scrollTop';
    scrollBtn.className = 'scroll-top';
    scrollBtn.setAttribute('aria-label', 'Retour en haut');
    scrollBtn.innerHTML = '<iconify-icon icon="lucide:arrow-up" width="18"></iconify-icon>';
    document.body.appendChild(scrollBtn);
  }
  window.addEventListener('scroll', () => {
    scrollBtn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
} catch (err) { /* non critique */ }

// ============ FICHES UE DÉPLIABLES (accessibilité ARIA) ============
try {
  document.querySelectorAll('.evi-card').forEach((card, i) => {
    const detail = card.querySelector('.evi-detail');
    const foot   = card.querySelector('.evi-foot');
    const title  = card.querySelector('.evi-title');
    if (!detail || !foot) return;

    const id = 'ue-detail-' + i;
    detail.id = id;
    foot.setAttribute('role', 'button');
    foot.setAttribute('tabindex', '0');
    foot.setAttribute('aria-expanded', 'false');
    foot.setAttribute('aria-controls', id);
    if (title) foot.setAttribute('aria-label', 'Voir détails de ' + title.textContent.trim());

    function toggle() {
      const open = card.classList.toggle('open');
      foot.setAttribute('aria-expanded', String(open));
      foot.textContent = open ? 'Masquer détails' : 'Voir détails';
    }

    foot.addEventListener('click', toggle);
    foot.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  });
} catch (err) { console.error('UE toggle:', err); }

// ============ MENU MOBILE (accessibilité + fermeture Echap) ============
try {
  const menuBtn    = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (menuBtn && mobileMenu) {
    menuBtn.setAttribute('aria-label', 'Ouvrir le menu de navigation');
    menuBtn.setAttribute('aria-controls', 'mobileMenu');
    menuBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('role', 'navigation');
    mobileMenu.setAttribute('aria-label', 'Menu mobile');

    function closeMenu() {
      mobileMenu.classList.remove('open');
      menuBtn.textContent = '☰';
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.setAttribute('aria-label', 'Ouvrir le menu de navigation');
    }

    menuBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      menuBtn.textContent = isOpen ? '✕' : '☰';
      menuBtn.setAttribute('aria-expanded', String(isOpen));
      menuBtn.setAttribute('aria-label', isOpen ? 'Fermer le menu de navigation' : 'Ouvrir le menu de navigation');
    });

    // Fermer si clic sur un lien
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Fermer avec la touche Échap
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
    });

    // Fermer si clic en dehors du menu
    document.addEventListener('click', (e) => {
      if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) closeMenu();
    });
  }
} catch (err) { console.error('Menu mobile:', err); }

// ============ HERO — révélation au chargement + compteurs ============
try {
  // Révélation immédiate au chargement de la page
  function revealElements() {
    document.querySelectorAll('.reveal-line').forEach(el => {
      el.classList.add('visible');
    });
    document.querySelectorAll('.reveal-on-load').forEach(el => {
      el.classList.add('visible');
    });
  }
  
  // Utiliser DOMContentLoaded pour garantir que le DOM est prêt
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', revealElements);
  } else {
    revealElements();
  }

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    if (isNaN(target)) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { el.textContent = target; return; }
    const duration = 1200;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const statsObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('[data-count]').forEach(animateCount);
      statsObs.unobserve(e.target);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.cover-stats').forEach(el => statsObs.observe(el));
} catch (err) { console.error('Hero reveal:', err); }

// ============ PARALLAXE ORBES AU SCROLL ============
try {
  const hero = document.querySelector('.cover-hero');
  const orbs = document.querySelectorAll('.orb');
  if (hero && orbs.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      orbs.forEach((orb, i) => {
        orb.style.transform = `translateY(${y * (0.08 + i * 0.04)}px)`;
      });
    }, { passive: true });
  }
} catch (err) { /* non critique */ }

// ============ FADE-UP AU SCROLL (IntersectionObserver optimisé) ============
try {
  const fadeEls = document.querySelectorAll('.fade-up');

  if (fadeEls.length === 0) { /* pas d'éléments animés sur cette page */ }
  else {

  // Décalage automatique dans les grilles
  document.querySelectorAll('.grid-3, .grid-4, .grid-2, .stagger-group').forEach(grid => {
    grid.querySelectorAll('.fade-up').forEach((el, i) => {
      el.style.transitionDelay = `${i * 80}ms`;
    });
  });

  if (window.IntersectionObserver) {
    const fadeObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          fadeObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    fadeEls.forEach(el => {
      if (reducedMotion) {
        el.classList.add('visible');
      } else {
        fadeObs.observe(el);
      }
    });
  } else {
    fadeEls.forEach(el => el.classList.add('visible'));
  }
  }
} catch (err) { console.error('Fade-up:', err); }

// ============ NAVBAR : ombre au scroll ============
try {
  const navbar = document.getElementById('navbar');
  if (navbar) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      navbar.classList.toggle('scrolled', y > 10);
      lastScroll = y;
    }, { passive: true });
  }
} catch (err) { console.error('Navbar scroll:', err); }

// ============ FORMULAIRE DE CONTACT ============
// La validation + l'envoi (Web3Forms) sont gérés par form-validation.js
// (un seul gestionnaire de soumission pour éviter les doublons/conflits).

// ============ NAVIGATION CLAVIER ENTRE ONGLETS ============
try {
  const tabs = Array.from(document.querySelectorAll('.tab'));
  tabs.forEach((tab, i) => {
    tab.addEventListener('keydown', (e) => {
      let next = null;
      if (e.key === 'ArrowRight') next = tabs[i + 1] || tabs[0];
      if (e.key === 'ArrowLeft')  next = tabs[i - 1] || tabs[tabs.length - 1];
      if (next) { e.preventDefault(); next.focus(); }
    });
  });
} catch (err) { console.error('Tab keyboard nav:', err); }

try {
  const logo = document.querySelector('.nav-logo');
  if (logo && logo.getAttribute('href') === 'index.html') {
    logo.setAttribute('title', 'Retour à la couverture');
  }
} catch (err) { /* non critique */ }
