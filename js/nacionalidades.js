document.getElementById("return").addEventListener("click", () => {
    window.api.navigate("./src/dashboard.html");
} );

document.addEventListener('DOMContentLoaded', async () => {
    const idInput = document.getElementById('id_Nacionalidad');
    const nameInput = document.getElementById('Nombre');
    const form = document.getElementById('nacionalidadForm');
    const tableBody = document.getElementById('nacionalidadTable');
  
    idInput.addEventListener('blur', async () => {
      const id = idInput.value.trim();
      if (id) {
        const data = await window.api.getNacionalidad(id);
        if (data) {
          nameInput.value = data.Nombre;
        } else {
          nameInput.value = '';
        }
      }
    });
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = idInput.value.trim();
      const nombre = nameInput.value.trim();
  
      if (id && nombre) {
        try {
          await window.api.saveNacionalidad(id, nombre);
          
          await loadTable();
        } catch (error) {
            console.error('Error al guardar nacionalidad:', error);
            
        }
      }
    });
  
    async function loadTable() {
      const nacionalidades = await window.api.getAllNacionalidades();
      tableBody.innerHTML = nacionalidades
        .map(
          (nac) =>
            `<tr>
              <td class="border border-gray-500 px-4 py-2">${nac.id_Nacionalidad}</td>
              <td class="border border-gray-500 px-4 py-2">${nac.Nombre}</td>
            </tr>`
        )
        .join('');
    }
  
    loadTable();
  });