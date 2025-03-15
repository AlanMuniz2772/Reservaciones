const { ipcRenderer } = require('electron');

window.login = function(id_empleado, password) {
    
    ipcRenderer.send('login', { id_empleado, password });
  };

ipcRenderer.on('loginResponse', (event, response) => {
    console.log("sesion iniciada",response);
    if (response.success) {
        
        sessionStorage.setItem("user", JSON.stringify(response.userSession));
        ipcRenderer.send('navigate', './src/dashboard.html');
    } else {
        window.handleLoginError(response.message);
    }
});

