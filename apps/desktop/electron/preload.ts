import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("canonkeeper", {
  ping: async () => ipcRenderer.invoke("app:ping"),
  project: {
    createOrOpen: async (payload: { rootPath: string; name?: string }) =>
      ipcRenderer.invoke("project:createOrOpen", payload),
    getStatus: async () => ipcRenderer.invoke("project:getStatus"),
    addDocument: async (payload: { path: string }) =>
      ipcRenderer.invoke("project:addDocument", payload)
  }
});
