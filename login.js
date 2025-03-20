document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const inputs = form.querySelectorAll("input");
    const loginBtn = document.getElementById("loginBtn");
    const errorMsg = document.getElementById("errorMsg");
    const emptyFieldsMsg = document.getElementById("emptyFieldsMsg");
  
    // 🎯 Manejar el Enter para pasar al siguiente input
    inputs.forEach((input, index) => {
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          const nextInput = inputs[index + 1];
          if (nextInput) {
            nextInput.focus();
          } else {
            loginBtn.click();
          }
        }
      });
    });
  
    // 🛠️ Validación y ejecución del login
    loginBtn.addEventListener("click", async (e) => {
      e.preventDefault();
  
      const id = document.getElementById("id_empleado").value.trim();
      const password = document.getElementById("password").value.trim();
  
      if (!id) return showMessage(emptyFieldsMsg, "Por favor, ingresa tu ID");
      if (!password)
        return showMessage(emptyFieldsMsg, "Por favor, ingresa tu contraseña");
  
      clearMessages();
  
      try {
        // 🔥 Llamada al login del main
        const response = await window.api.login(id, password);
  
        if (response.success) {
          console.log("✅ Sesión iniciada correctamente");
          sessionStorage.setItem("user", JSON.stringify(response.user));
          window.api.navigate("./src/dashboard.html");
        } else {
          handleLoginError(response.message);
        }
      } catch (error) {
        console.error("❌ Error en el login:", error);
        handleLoginError("Hubo un problema con el servidor.");
      }
    });
  
    // ⚡ Muestra errores
    function showMessage(element, message) {
      element.textContent = message;
      element.classList.remove("hidden");
    }
  
    function clearMessages() {
      emptyFieldsMsg.textContent = "";
      errorMsg.classList.add("hidden");
    }
  
    function handleLoginError(message) {
      showMessage(errorMsg, message);
    }
  });
  