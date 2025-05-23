const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("db", {
  login: (id, password) => ipcRenderer.invoke("login", id, password),
  getRow: (parameters,data) => ipcRenderer.invoke('getRow', parameters,data),
  getAll: (parameters) => ipcRenderer.invoke('getAll', parameters),
  deleteRow: (parameters, data) => ipcRenderer.invoke('deleteRow', parameters, data),
  saveNacionalidad: (parameters, data) => ipcRenderer.invoke('saveNacionalidad', parameters, data),
  saveVuelo: (parameters, data) => ipcRenderer.invoke('saveVuelo', parameters, data),
  selectAll: (parameters, data) => ipcRenderer.invoke('selectAll', parameters, data),
});

contextBridge.exposeInMainWorld("api", {
  navigate: (page) => ipcRenderer.send("navigate", page),
});