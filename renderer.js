const { ipcRenderer } = require('electron');

document.getElementById('loginBtn').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    console.log('Enviando credenciales al proceso principal');
    ipcRenderer.send('login', { username, password });
});

ipcRenderer.on('loginResponse', (event, response) => {
    if (response.success) {
        alert(`Login exitoso. ID de usuario: ${response.userId}`);
        // Aquí puedes redirigir a otra ventana o guardar la sesión
    } else {
        document.getElementById('errorMsg').classList.remove('hidden');
    }
});
