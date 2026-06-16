/* ── Año dinámico ── */
document.getElementById('year').textContent = new Date().getFullYear();

/* ── Hamburger ── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

/* ── Validación del formulario ── */
const form = document.getElementById('cotizacionForm');

function setValidity(groupId, isValid, msg) {
  const group = document.getElementById(groupId);
  if (!group) return;
  group.classList.remove('valid', 'invalid');
  group.classList.add(isValid ? 'valid' : 'invalid');
  if (!isValid && msg) {
    const errEl = group.querySelector('.error-msg');
    if (errEl) errEl.textContent = msg;
  }
}

function validateField(id) {
  const el = document.getElementById(id);
  if (!el) return true;
  const val = el.value.trim();
  const groupId = 'group-' + id;

  if (id === 'nombre') {
    const ok = val.length >= 3;
    setValidity(groupId, ok);
    return ok;
  }
  if (id === 'email') {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    setValidity(groupId, ok);
    return ok;
  }
  if (id === 'telefono') {
    const ok = /^[\d\s\+\-\(\)]{7,}$/.test(val);
    setValidity(groupId, ok);
    return ok;
  }
  if (id === 'personas') {
    const n = parseInt(val);
    const ok = !isNaN(n) && n >= 1;
    setValidity(groupId, ok);
    return ok;
  }
  if (id === 'destino') {
    const ok = val !== '';
    setValidity(groupId, ok);
    return ok;
  }
  if (id === 'fecha-ida') {
    const today = new Date(); today.setHours(0,0,0,0);
    const d = new Date(val + 'T00:00:00');
    const ok = val !== '' && d >= today;
    setValidity(groupId, ok, ok ? '' : 'La fecha de salida debe ser hoy o posterior.');
    return ok;
  }
  if (id === 'fecha-vuelta') {
    const ida = document.getElementById('fecha-ida').value;
    const ok = val !== '' && (!ida || new Date(val + 'T00:00:00') > new Date(ida + 'T00:00:00'));
    setValidity(groupId, ok);
    return ok;
  }
  return true;
}

/* Validación en tiempo real */
['nombre','email','telefono','personas','destino','fecha-ida','fecha-vuelta'].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('blur', () => validateField(id));
    el.addEventListener('input', () => {
      const group = document.getElementById('group-' + id);
      if (group && group.classList.contains('invalid')) validateField(id);
    });
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const fields = ['nombre','email','telefono','personas','destino','fecha-ida','fecha-vuelta'];
  const allValid = fields.map(id => validateField(id)).every(Boolean);
  if (allValid) {
    form.style.display = 'none';
    document.getElementById('form-success').style.display = 'block';
  } else {
    const firstInvalid = form.querySelector('.invalid input, .invalid select, .invalid textarea');
    if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
});