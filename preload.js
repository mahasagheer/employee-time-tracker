const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, listener) => ipcRenderer.on(channel, listener)
  },
  db: {
    addEmployee: (employee) => ipcRenderer.invoke('db:add-employee', employee),
    getEmployees: () => ipcRenderer.invoke('db:get-employees'),
  }
});
let interval = null;
let sessionId = null;
