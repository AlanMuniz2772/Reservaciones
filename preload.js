const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  login: (id, password) => ipcRenderer.invoke("login", { id, password }),
  getNacionalidad: (id) => ipcRenderer.invoke('getNacionalidad', id),
  getAllNacionalidades: () => ipcRenderer.invoke('getAllNacionalidades'),
  saveNacionalidad: (id, nombre) => ipcRenderer.invoke('saveNacionalidad', id, nombre),
  deleteNacionalidad: (id) => ipcRenderer.invoke('deleteNacionalidad', id),
  navigate: (page) => ipcRenderer.send("navigate", page),
});
