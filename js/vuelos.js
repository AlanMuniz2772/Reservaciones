document.getElementById("return").addEventListener("click", () => {
    window.api.navigate("./src/dashboard.html");
} );

document.addEventListener('DOMContentLoaded', async () => {
    const inputs = document.querySelectorAll('#vuelosForm input');
    const idInput = document.getElementById('id_Vuelo');
    const aeropuertoSelect = document.getElementById('Aeropuerto');
    const aerolineaSelect = document.getElementById('Aerolinea');
    const fechaSalidaInput = document.getElementById('fecha_salida');
    const fechaLlegadaInput = document.getElementById('fecha_llegada');
    const costoInput = document.getElementById('costo');
    const horaEntrada = document.getElementById('hora_entrada');
    const horaSalida = document.getElementById('hora_salida');
    const saveButton = document.getElementById('guardar');
    const deleteButton = document.getElementById('eliminar');
    const tableBody = document.getElementById('vuelosTable');
  
    // Agregamos el evento keydown a cada input
    inputs.forEach((input, index) => {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault(); // Evita que el Enter haga un submit o algo raro

          // Saltamos al siguiente input si existe
          const nextInput = inputs[index + 1];
          if (nextInput) {
            nextInput.focus();
          } else {
            // Si no hay más inputs, podemos activar el botón de guardar
            document.getElementById('guardar').focus();
          }
        }
      });
    });

    const aeropuertos = await window.api.getAll({ table: "aeropuerto" });
    aeropuertoSelect.innerHTML = aeropuertos
      .map(
        (aeropuerto) =>
          `<option value="${aeropuerto.id_Aeropuerto}">${aeropuerto.Nombre}</option>`
      )
      .join('');

      const aerolineas = await window.api.getAll({ table: "aerolinea" });
      aerolineaSelect.innerHTML = aerolineas
        .map(
          (aerolinea) =>
            `<option value="${aerolinea.id_Aerolinea}">${aerolinea.Nombre}</option>`
        )
        .join('');

    idInput.addEventListener('input', async () => {
      const id = idInput.value.trim();
      if (id) {
        const data = await window.api.getRow({ table: 'nacionalidad', column: 'id_Nacionalidad' }, { id: id });
        if (data) {
          nameInput.value = data.Nombre;
        } else {
          nameInput.value = '';
        }
      }
      else {
        nameInput.value = '';
      }
    });
    


    saveButton.addEventListener('click', async () => {
      const id = idInput.value.trim();
      const nombre = nameInput.value.trim();
  
      if (id && nombre) {
        try {
          await window.api.saveNacionalidad({ table: 'nacionalidad', column: 'id_Nacionalidad' }, { id: id, nombre: nombre });
          showModal("Guardado", "Nacionalidad guardada correctamente", "success");
          await loadTable();
        } catch (error) {
            showModal("Error", "Error al guardar la nacionalidad", "error");
            
        }
      }else{
        showModal("Error", "Por favor, rellena todos los campos", "error");
      }
    });

    deleteButton.addEventListener('click', async () => {
      const id = idInput.value.trim();
  
      if (id) {
        result = await window.api.deleteRow({ table: 'nacionalidad', column: 'id_Nacionalidad' }, { id: id });
        if (result.success) {
          showModal("Eliminado", "Nacionalidad eliminada correctamente", "success");
          await loadTable();
        } else {
          showModal("Error", result.message, "error");
        }
      }else{
        showModal("Error", "Por favor, selecciona una nacionalidad", "error");
      }
    });
  
    async function loadTable() {
      const nacionalidades = await window.api.getAll({ table: "nacionalidad"});
      tableBody.innerHTML = nacionalidades
        .map(
          (nac) =>
           `<tr data-id="${nac.id_Nacionalidad}" data-nombre="${nac.Nombre}" class="cursor-pointer hover:bg-gray-200">
            <td class="border border-gray-500 px-4 py-2">${nac.id_Vuelo}</td>
            <td class="border border-gray-500 px-4 py-2">${nac.Nombre}</td>
          </tr>`
        )
        .join('');

        document.querySelectorAll("#nacionalidadTable tr").forEach((row) => {
          row.addEventListener("click", () => {
            const id = row.getAttribute("data-id");
            const nombre = row.getAttribute("data-nombre");
      
            // Rellenar los inputs
            document.getElementById("id_Nacionalidad").value = id;
            document.getElementById("Nombre").value = nombre;
      
            // Dar foco al siguiente input
            document.getElementById("Nombre").focus();
          });
        });
    }

  
    loadTable();
  });

  function showModal(title, message, type = "info") {
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modal-title");
    const modalMessage = document.getElementById("modal-message");
  
    modalTitle.textContent = title;
    modalMessage.textContent = message;
  
    // Personalizar estilos según el tipo de mensaje
    if (type === "success") {
      modalTitle.className = "text-green-500 text-xl font-bold mb-2";
    } else if (type === "error") {
      modalTitle.className = "text-red-500 text-xl font-bold mb-2";
    } else {
      modalTitle.className = "text-blue-500 text-xl font-bold mb-2";
    }
  
    modal.classList.remove("hidden");
  
    // Cerrar el modal al hacer clic en el botón
    document.getElementById("close-modal").addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  }

  function validarLongitud(input) {
    // Verifica si el valor tiene más de 10 dígitos
    if (input.value.length > 10) {
      // Corta el valor a 10 dígitos
      input.value = input.value.slice(0, 10);
    }
  }