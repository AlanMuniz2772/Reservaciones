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
    const nombreUsuario = document.getElementById('usuario');
    const fechaActual = document.getElementById('fecha_actual');
  
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

    const aeropuertos = await window.db.getAll({ table: "aeropuerto" });
    aeropuertoSelect.innerHTML = `
      <option value="">Seleccione Aeropuerto</option>
      ${aeropuertos
      .map(
        (aeropuerto) =>
        `<option value="${aeropuerto.id_Aeropuerto}">${aeropuerto.Nombre}</option>`
      )
      .join('')}`;

      // const aerolineas = await window.db.getAll({ table: "aerolinea" });
      // aerolineaSelect.innerHTML = `
      //   <option value="">Seleccione Aerolínea</option>
      //   ${aerolineas
      //     .map(
      //   (aerolinea) =>
      //     `<option value="${aerolinea.id_Aerolinea}">${aerolinea.Nombre}</option>`
      //     )
      //     .join('')}`;


    aeropuertoSelect.addEventListener('change', async () => {
      const id = aeropuertoSelect.value;
      if (id) {
        const resultados = await window.db.selectAll({ table: 'Aeropuerto_aerolinea', column: 'id_Aeropuerto' }, { id: id });
        if (resultados) {
          const aerolineas = [];

          for (const resultado of resultados) {
            const idAerolinea = resultado.id_Aerolinea;
            const aerolinea = await window.db.getRow(
              { table: 'aerolinea', column: 'id_Aerolinea' },
              { id: idAerolinea }
            );
            aerolineas.push(aerolinea); // Guardamos el objeto en la lista
          }
          console.log(aerolineas);
          if (aerolineas) {
              aerolineaSelect.innerHTML = `
                <option value="">Seleccione Aerolínea</option>
                ${aerolineas
                  .map(
                (aerolinea) =>
                  `<option value="${aerolinea.id_Aerolinea}">${aerolinea.Nombre}</option>`
                )
                .join('')}`
            };
        } else {
          console.error("Sin aerolineas");
        }
      }
    });

    idInput.addEventListener('input', async () => {
      const id = idInput.value.trim();
      if (id == '') { 
        aeropuertoSelect.value = '';
        aerolineaSelect.value = '';
        fechaSalidaInput.value = '';
        horaSalida.value = '';
        fechaLlegadaInput.value = '';
        horaEntrada.value = '';
        costoInput.value = '';
      }
    });
    


    saveButton.addEventListener('click', async () => {
      const id = idInput.value.trim();
      const id_Aerolinea = aerolineaSelect.value;
      const id_Aeropuerto = aeropuertoSelect.value;
      const fechaSalida = fechaSalidaInput.value.trim() + " " + horaSalida.value.trim() + ":00";
      const fechaLlegada = fechaLlegadaInput.value.trim() + " " + horaEntrada.value.trim() + ":00";
      const costo = costoInput.value.trim();
  
      if (id && id_Aerolinea && id_Aeropuerto && fechaSalida && fechaLlegada && costo) {
        try {
          await window.db.saveVuelo({ table: 'vuelo', column: 'id_Vuelo' }, { id: id, id_Aerolinea: id_Aerolinea, id_Aeropuerto: id_Aeropuerto, fechaSalida: fechaSalida, fechaLlegada: fechaLlegada, costo: costo });
          showModal("Guardado", "Vuelo guardado correctamente", "success");
          await loadTable();
        } catch (error) {
          console.error("Error al guardar el vuelo:", error);
            showModal("Error", "Error al guardar el vuelo", "error");
        }
      }else{
        showModal("Error", "Por favor, rellena todos los campos", "error");
      }
    });

    deleteButton.addEventListener('click', async () => {
      const id = idInput.value.trim();
      console.log("eliminar")
      if (id) {
        result = await window.db.deleteRow({ table: 'vuelo', column: 'id_Vuelo' }, { id: id });
        if (result.success) {
          showModal("Eliminado", "Vuelo eliminado correctamente", "success");
          await loadTable();
        } else {
          showModal("Error", result.message, "error");
        }
      }else{
        showModal("Error", "Por favor, selecciona un vuelo", "error");
      }
    });
  
    async function loadTable() {
      const vuelos = await window.db.getAll({ table: "vuelo" });
    
      tableBody.innerHTML = vuelos
        .map((v) => {
          // Separar fecha y hora de las columnas datetime
          const fechaSalida = new Date(v.Fecha_salida);
          const fechaLlegada = new Date(v.Fecha_llegada);
    
          const salidaFecha = fechaSalida.toISOString().split('T')[0]; // yyyy-mm-dd
          const salidaHora = fechaSalida.toTimeString().split(' ')[0].slice(0, 5); // hh:mm
    
          const llegadaFecha = fechaLlegada.toISOString().split('T')[0];
          const llegadaHora = fechaLlegada.toTimeString().split(' ')[0].slice(0, 5);
          
          return `
            <tr class="cursor-pointer hover:bg-gray-200"
                data-id="${v.id_Vuelo}"
                data-fecha-salida="${salidaFecha}"
                data-hora-salida="${salidaHora}"
                data-fecha-llegada="${llegadaFecha}"
                data-hora-llegada="${llegadaHora}"
                data-costo="${v.Costo}"
                data-aeropuerto-aerolinea="${v.id_Aerolinea_Aeropuerto}">
              <td class="border border-gray-500 px-4 py-2">${v.id_Vuelo}</td>
              <td class="border border-gray-500 px-4 py-2">${salidaFecha}</td>
              <td class="border border-gray-500 px-4 py-2">${llegadaFecha}</td>
              <td class="border border-gray-500 px-4 py-2">$${v.Costo}</td>
              <td class="border border-gray-500 px-4 py-2">${salidaHora}</td>
              <td class="border border-gray-500 px-4 py-2">${llegadaHora}</td>
            </tr>`;
        })
        .join('');
    
      // Evento para rellenar inputs al dar click en una fila
      document.querySelectorAll("#vuelosTable tr").forEach((row) => {
        row.addEventListener("click", async () => {
          console.log(row.getAttribute("data-aeropuerto"));
          document.getElementById("id_Vuelo").value = row.getAttribute("data-id");
          document.getElementById("fecha_salida").value = row.getAttribute("data-fecha-salida");
          document.getElementById("hora_salida").value = row.getAttribute("data-hora-salida");
          document.getElementById("fecha_llegada").value = row.getAttribute("data-fecha-llegada");
          document.getElementById("hora_entrada").value = row.getAttribute("data-hora-llegada");
          document.getElementById("costo").value = row.getAttribute("data-costo");

          const aeropuerto_aerolinea = row.getAttribute("data-aeropuerto-aerolinea");
          respuesta = await window.db.getRow({ table: 'aeropuerto_aerolinea', column: 'id_Aeropuerto_Aerolinea' }, { id: aeropuerto_aerolinea });
          console.log(respuesta);
          document.getElementById("Aeropuerto").value = respuesta.id_Aeropuerto;
          document.getElementById("Aerolinea").value = respuesta.id_Aerolinea;
        });
      });
    }
    

    if (usuario) {
      const usuarioObj = JSON.parse(usuario);
      nombre_usuario = " - " + usuarioObj.Apaterno + " " + usuarioObj.Amaterno;
      nombreUsuario.innerHTML = nombre_usuario;
    } else {
      showModal("Error", "Usuario no encontrado en la sesión", "error");
    }

    // Obtener la fecha actual
    const fecha = new Date();
    fechaActual.innerHTML = `${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString()}`;
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

  // Obtener el usuario desde sessionStorage y mostrarlo en el elemento correspondiente
  const usuario = sessionStorage.getItem('user');
  