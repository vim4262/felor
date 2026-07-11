/* ============================================================
   VALIDATION DU FORMULAIRE DE CONTACT
   Améliorée avec validation côté client robuste
   ============================================================ */

'use strict';

class ContactFormValidator {
  constructor(formId) {
    this.form = document.getElementById(formId);
    if (!this.form) return;

    this.submitBtn = document.getElementById('submitBtn');
    this.successMsg = document.getElementById('formSuccess');
    this.errorMsg = document.getElementById('formError');
    
    this.init();
  }

  init() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Validation en temps réel
    const inputs = this.form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });
  }

  validateField(field) {
    const errorSpan = document.getElementById(`${field.id}-error`);
    if (!errorSpan) return true;

    let isValid = true;
    let errorMessage = '';

    // Validation required
    if (field.hasAttribute('required') && !field.value.trim()) {
      isValid = false;
      errorMessage = 'Ce champ est requis';
    }

    // Validation email
    if (field.type === 'email' && field.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value)) {
        isValid = false;
        errorMessage = 'Email invalide';
      }
    }

    // Validation minlength
    if (field.hasAttribute('minlength') && field.value.length < parseInt(field.getAttribute('minlength'))) {
      isValid = false;
      errorMessage = `Minimum ${field.getAttribute('minlength')} caractères requis`;
    }

    // Afficher l'erreur
    if (!isValid) {
      errorSpan.textContent = errorMessage;
      errorSpan.style.display = 'block';
      field.setAttribute('aria-invalid', 'true');
    } else {
      this.clearFieldError(field);
    }

    return isValid;
  }

  clearFieldError(field) {
    const errorSpan = document.getElementById(`${field.id}-error`);
    if (errorSpan) {
      errorSpan.textContent = '';
      errorSpan.style.display = 'none';
    }
    field.setAttribute('aria-invalid', 'false');
  }

  validateForm() {
    const inputs = this.form.querySelectorAll('input, select, textarea');
    let isValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  async handleSubmit(e) {
    e.preventDefault();

    if (!this.validateForm()) {
      this.showError('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    // Désactiver le bouton pendant l'envoi
    this.submitBtn.disabled = true;
    this.submitBtn.innerHTML = '<iconify-icon icon="lucide:loader-2" width="16" class="spin"></iconify-icon> Envoi en cours...';

    try {
      const formData = new FormData(this.form);
      const data = Object.fromEntries(formData.entries());

      const key = window.SITE?.web3formsKey;
      if (key && key !== 'COLLE_TA_CLE_WEB3FORMS_ICI') {
        await this.sendWithWeb3Forms(data, key);
      } else {
        // Clé non configurée : repli sur mailto (ouvre le client mail du visiteur)
        this.sendWithMailto(data);
      }

      this.showSuccess();
      this.form.reset();
    } catch (error) {
      console.error('Erreur formulaire:', error);
      this.showError('Une erreur s\'est produite lors de l\'envoi');
    } finally {
      this.submitBtn.disabled = false;
      this.submitBtn.innerHTML = '<iconify-icon icon="lucide:send" width="16"></iconify-icon> Envoyer le message';
    }
  }

  async sendWithWeb3Forms(data, accessKey) {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `Portfolio — Nouveau message : ${data.sujet || 'Contact'}`,
        from_name: `${data.prenom || ''} ${data.nom || ''}`.trim() || 'Visiteur portfolio',
        ...data,
      }),
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Erreur Web3Forms');
    }
  }

  sendWithMailto(data) {
    const subject = encodeURIComponent(`Contact Portfolio: ${data.sujet}`);
    const body = encodeURIComponent(
      `Nom: ${data.nom}\n` +
      `Prénom: ${data.prenom}\n` +
      `Email: ${data.email}\n` +
      `Sujet: ${data.sujet}\n\n` +
      `Message:\n${data.message}`
    );
    
    const mailtoLink = `mailto:${window.SITE?.email || 'felicioekoe3@gmail.com'}?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
  }

  showSuccess() {
    this.successMsg.style.display = 'flex';
    this.errorMsg.style.display = 'none';
    
    setTimeout(() => {
      this.successMsg.style.display = 'none';
    }, 5000);
  }

  showError(message) {
    this.errorMsg.innerHTML = `<iconify-icon icon="lucide:alert-circle" width="16"></iconify-icon> ${message}`;
    this.errorMsg.style.display = 'flex';
    this.successMsg.style.display = 'none';
    
    setTimeout(() => {
      this.errorMsg.style.display = 'none';
    }, 5000);
  }
}

// Initialiser quand le DOM est prêt
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ContactFormValidator('contactForm');
  });
} else {
  new ContactFormValidator('contactForm');
}