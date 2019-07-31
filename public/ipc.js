const path = require("path");
const fs = require("fs");
const { ipcMain, dialog } = require("electron");

/**
 * 监听打开文件
 */
ipcMain.on("open-file-dialog", event => {
  dialog.showOpenDialog(
    {
      title: "请选择一个文件",
      properties: ["openFile"],
      filters: [
        { name: "Swagger Files", extensions: ["yaml", "yml", "json"] },
        { name: "All Files", extensions: ["*"] }
      ]
    },
    filePaths => {
      if (filePaths) {
        event.sender.send("open-file-ok", filePaths);
      } else {
        event.sender.send("open-file-err");
      }
    }
  );
});

/**
 * 监听保存文件
 */
ipcMain.on("save-file-dialog", event => {
  dialog.showSaveDialog(
    {
      title: "保存文件",
      defaultPath: "swagger.yaml",
      filters: [
        { name: "Swagger Files", extensions: ["yaml", "yml", "json"] },
        { name: "All Files", extensions: ["*"] }
      ]
    },
    filePath => {
      if (filePath) {
        event.sender.send("save-file-ok", filePath);
      } else {
        event.sender.send("save-file-err");
      }
    }
  );
});

/**
 * 监听读取文件
 */
ipcMain.on("read-file", (event, filePath) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      event.sender.send("read-file-err", err);
    } else {
      event.sender.send("read-file-ok", data);
    }
  });
});

/**
 * 监听写入文件
 */
ipcMain.on("write-file", (event, filePath, data) => {
  fs.writeFile(filePath, data, err => {
    if (err) {
      event.sender.send("write-file-err", err);
    } else {
      event.sender.send("write-file-ok");
    }
  });
});

/**
 * 监听读取默认数据
 */
ipcMain.on("read-default-data", event => {
  const filePath = path.join(__dirname, "swagger.yaml");
  fs.readFile(filePath, (err, data) => {
    if (err) {
      event.sender.send("read-default-data-err", err);
    } else {
      event.sender.send("read-default-data-ok", data);
    }
  });
});
