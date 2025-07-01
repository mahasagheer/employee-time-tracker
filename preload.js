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

ipcMain.on("start-tracking", () => {
  sessionId = Date.now().toString();
  // Save session start to DB
  db.prepare("INSERT INTO sessions (id, start_time) VALUES (?, ?)").run(sessionId, new Date().toISOString());

  interval = setInterval(() => {
    takeScreenshot(sessionId);
  }, 5 * 60 * 1000); // every 5 minutes
});

ipcMain.on("stop-tracking", () => {
  clearInterval(interval);
  const endTime = new Date().toISOString();
  const session = db.prepare("SELECT start_time FROM sessions WHERE id = ?").get(sessionId);
  const duration = Math.floor((new Date(endTime) - new Date(session.start_time)) / 60000);

  db.prepare("UPDATE sessions SET end_time = ?, duration_minutes = ? WHERE id = ?").run(endTime, duration, sessionId);
});
