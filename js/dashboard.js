const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
        document.getElementById("user-name").textContent = user.Nombre;
    }

document.getElementById("nacionalidades").addEventListener("click", () => {
    window.api.navigate("./src/nacionalidades.html");
});