const { app, BrowserWindow,ipcMain,desktopCapturer } = require('electron');
const url = require('url');
const path = require('path');
const fs = require("fs");
const db = require('./db/database');
const { v4: uuidv4 } = require('uuid');

function createWindow() {
    const mainWindow = new BrowserWindow({
        title: 'Electron App',
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });
    // Load the React build output
    const startUrl = url.format({
        pathname: path.join(__dirname, 'my-app/build/index.html'),
        protocol: 'file',
        slashes: true,
    });
    mainWindow.loadURL(startUrl);
    mainWindow.webContents.openDevTools(); // Add this line
    
    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
      console.error('Failed to load:', errorDescription);
    });
    ipcMain.on("start-tracking", () => {
        console.log("Tracking started");
        // later: start timer, create session
      });
      ipcMain.on("stop-tracking", () => {
        console.log("Tracking stopped");
      });
      }

app.whenReady().then(createWindow);


async function takeScreenshot(sessionId) {
  const sources = await desktopCapturer.getSources({ types: ['screen'] });
  const screen = sources[0];

  const image = screen.thumbnail.toPNG();
  const folderPath = path.join(__dirname, 'screenshots', sessionId);
  if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

  const fileName = `screenshot-${Date.now()}.png`;
  fs.writeFileSync(path.join(folderPath, fileName), image);
}

ipcMain.handle('db:add-employee', (event, employee) => {
  const stmt = db.prepare(
    'INSERT INTO Employees (id, name, assigned_email, device_id, is_active) VALUES (?, ?, ?, ?, ?)' 
  );
  const id = uuidv4();
  stmt.run(id, employee.name, employee.assigned_email, employee.device_id, employee.is_active ?? 1);
  return id;
});

ipcMain.handle('db:get-employees', () => {
  return db.prepare('SELECT * FROM Employees').all();
});
