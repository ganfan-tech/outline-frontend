import { app, BrowserWindow } from "electron";
import * as path from "path";

let win: BrowserWindow | null = null;

app.whenReady().then(() => {
  win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // 预加载脚本
      nodeIntegration: false, // 禁用 Node.js 直接访问，提升安全性
      contextIsolation: true, // 启用上下文隔离
    },
  });

  win.loadURL("http://localhost:7001"); // 开发模式加载 Vite 服务器
  // if (process.env.VITE_DEV_SERVER_URL) {
  //   win.loadURL(process.env.VITE_DEV_SERVER_URL); // 开发模式加载 Vite 服务器
  // } else {
  //   win.loadFile(path.join(__dirname, "./index.html")); // 生产模式加载构建后的文件
  // }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
