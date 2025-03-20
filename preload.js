const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  login: (id, password) => ipcRenderer.invoke("login", { id, password }),
  navigate: (page) => ipcRenderer.send("navigate", page),
});
