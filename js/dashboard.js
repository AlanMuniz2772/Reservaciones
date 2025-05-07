// const user = JSON.parse(sessionStorage.getItem("user"));
//     if (user) {
//         document.getElementById("user-name").textContent = user.Nombre;
//     }

document.getElementById("nacionalidades").addEventListener("click", () => {
    window.api.navigate("./src/nacionalidades.html");
});

document.getElementById("vuelos").addEventListener("click", () => {
    window.api.navigate("./src/vuelos.html");
});

document.getElementById("salir").addEventListener("click", () => {
    sessionStorage.removeItem("user");
    window.api.navigate("./index.html");
});

nombreUsuario = document.getElementById("usuario");
const usuario = sessionStorage.getItem('user');
if (usuario) {
    const user = JSON.parse(usuario);
    nombreUsuario.innerHTML = "Bienvenido " + user.Nombre;
}