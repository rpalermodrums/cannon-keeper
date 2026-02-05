import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("canonkeeper", {
  ping: async () => ipcRenderer.invoke("app:ping")
});
