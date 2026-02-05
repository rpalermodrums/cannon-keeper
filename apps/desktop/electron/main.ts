import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;

function getPreloadPath(): string | undefined {
  const candidate = path.join(__dirname, "preload.js");
  return fs.existsSync(candidate) ? candidate : undefined;
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: getPreloadPath()
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  const devUrl = process.env.VITE_DEV_SERVER_URL;
  if (devUrl) {
    void mainWindow.loadURL(devUrl);
  } else {
    const indexPath = path.join(__dirname, "../dist-renderer/index.html");
    void mainWindow.loadFile(indexPath);
  }
}

app.whenReady().then(() => {
  createWindow();

  ipcMain.handle("app:ping", () => ({ ok: true }));

  app.on("activate", () => {
    if (mainWindow === null || BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
