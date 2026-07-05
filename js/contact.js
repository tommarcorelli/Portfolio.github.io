/* ================================================================
   12. FORMULAIRE DE CONTACT
   ================================================================ */
function initContactForm() {
  const form = $('.contact-form');
  if (!form) return;

  $$('.form-input', form).forEach(input => {
    input.addEventListener('blur',  () => validateField(input));
    input.addEventListener('input', () => clearFieldError(input));
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const inputs   = [...$$('.form-input', form)];
    const allValid = inputs.map(validateField).every(Boolean);
    if (!allValid) return;

    showFormFeedback(form, 'loading');

    try {
      const data     = new FormData(form);
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body:   data,
      });
      const json = await response.json();

      if (json.success) {
        showFormFeedback(form, 'success');
        form.reset();
      } else {
        showFormFeedback(form, 'error');
      }
    } catch {
      showFormFeedback(form, 'error');
    }
  });
}

function validateField(field) {
  clearFieldError(field);
  if (field.required && !field.value.trim()) {
    showFieldError(field, 'Ce champ est obligatoire.');
    return false;
  }
  if (field.type === 'email' && field.value.trim()) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())) {
      showFieldError(field, 'Adresse email invalide.');
      return false;
    }
  }
  if (field.id === 'contact-message') {
    if (field.value.trim().length < 10) {
      showFieldError(field, 'Le message doit contenir au moins 10 caractères.');
      return false;
    }
  }
  field.classList.add('form-input--valid');
  return true;
}

function showFieldError(field, msg) {
  field.classList.add('form-input--error');
  field.setAttribute('aria-invalid', 'true');
  const id = `${field.id}-error`;
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('p');
    el.id = id;
    el.classList.add('form-error-msg');
    el.setAttribute('role', 'alert');
    field.parentNode.appendChild(el);
    field.setAttribute('aria-describedby', id);
  }
  el.textContent = msg;
}

function clearFieldError(field) {
  field.classList.remove('form-input--error', 'form-input--valid');
  field.removeAttribute('aria-invalid');
  const el = document.getElementById(`${field.id}-error`);
  if (el) el.remove();
}

function showFormFeedback(form, state) {
  const btn = $('[type="submit"]', form);
  if (state === 'loading') {
    btn.disabled     = true;
    btn.textContent  = '◈ Envoi en cours...';
  }
  if (state === 'success') {
    btn.disabled     = false;
    btn.textContent  = '✓ Message envoyé !';
    btn.classList.add('btn--success');
    setTimeout(() => {
      btn.textContent = '◈ Envoyer le message';
      btn.classList.remove('btn--success');
    }, 3000);
  }
  if (state === 'error') {
    btn.disabled    = false;
    btn.textContent = '✗ Erreur — Réessayer';
    btn.classList.add('btn--error');
    setTimeout(() => {
      btn.textContent = '◈ Envoyer le message';
      btn.classList.remove('btn--error');
    }, 3000);
  }
}

