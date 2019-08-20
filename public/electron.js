// 判断是否开发环境
const isDev = require("electron-is-dev");
// Modules to control application life and create native browser window
const { app, BrowserWindow } = require("electron");
const path = require("path");
const os = require("os");

// ipc事件监听
require("./ipc");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    minWidth: 960,
    minHeight: 300,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  // mainWindow.loadFile('index.html')
  if (isDev) {
    mainWindow.loadURL("http://localhost:3000/");
  } else {
    mainWindow.loadFile(path.join(__dirname, "/../build/index.html"));
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on("closed", function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  // 如果是开发环境
  // 安装浏览器插件
  if (isDev) {
    // 打开开发者工具
    mainWindow.webContents.openDevTools();

    // 参考：https://electronjs.org/devtron
    // devtron
    require("devtron").install();

    // 参考：https://github.com/MarshallOfSound/electron-devtools-installer
    // 可能网络问题，此方法未能安装成功
    // const {
    //   default: installExtension,
    //   REACT_DEVELOPER_TOOLS,
    //   REDUX_DEVTOOLS,
    // } = require('electron-devtools-installer')
    // installExtension(REACT_DEVELOPER_TOOLS)
    //     .then((name) => console.log(`Added Extension:  ${name}`))
    //     .catch((err) => console.log('An error occurred: ', err))
    // installExtension(REDUX_DEVTOOLS)
    //     .then((name) => console.log(`Added Extension:  ${name}`))
    //     .catch((err) => console.log('An error occurred: ', err))

    // React Developer Tools
    // Redux DevTools
    // 参考：https://electronjs.org/docs/tutorial/devtools-extension
    // 注意：以下路径请改成本人实际路径
    // BrowserWindow.addDevToolsExtension(
    //   path.join(
    //     os.homedir(),
    //     ".config/chromium/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/3.6.0_0"
    //   )
    // );
    // BrowserWindow.addDevToolsExtension(
    //   path.join(
    //     os.homedir(),
    //     ".config/chromium/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.17.0_0"
    //   )
    // );
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function() {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function() {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
