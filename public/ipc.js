const path = require("path");
const fs = require("fs");
const { ipcMain, dialog } = require("electron");
const downloadRepo = require("download-git-repo");
const ejs = require("ejs");
const prettier = require("prettier");

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
        { name: "All Files", extensions: ["*"] },
      ],
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
        { name: "All Files", extensions: ["*"] },
      ],
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

/**
 * 监听读取缓存数据
 */
ipcMain.on("read-cache", event => {
  const filePath = path.join(__dirname, "cache.yaml");
  fs.readFile(filePath, (err, data) => {
    if (err) {
      event.sender.send("read-cache-err", err);
    } else {
      event.sender.send("read-cache-ok", data);
    }
  });
});

/**
 * 监听写入缓存
 */
ipcMain.on("write-cache", (event, data) => {
  const filePath = path.join(__dirname, "cache.yaml");
  fs.writeFile(filePath, data, err => {
    if (err) {
      event.sender.send("write-cache-err", err);
    } else {
      event.sender.send("write-cache-ok");
    }
  });
});

const boilerplates = {
  koa: "fishjar/koa-rest-boilerplate#dev",
};
ipcMain.on("download-boilerplate", (event, boilerplateName) => {
  const repo = boilerplates[boilerplateName];
  const temDir = path.join(__dirname, "tmp", boilerplateName);
  downloadRepo(repo, temDir, err => {
    if (err) {
      event.sender.send("download-boilerplate-err", err);
    } else {
      event.sender.send("download-boilerplate-ok");
    }
  });
});

ipcMain.on(
  "generate-boilerplate",
  (event, boilerplateName, { definitions, dataFormats }) => {
    // const repo = boilerplates[boilerplateName];
    // const temDir = path.join(__dirname, "tmp", boilerplateName);
    // downloadRepo(repo, temDir, err => {
    //   if (err) {
    //     event.sender.send("download-boilerplate-err", err);
    //   } else {
    //     event.sender.send("download-boilerplate-ok");
    //   }
    // });
    const [modelKey, model] = Object.entries(definitions).find(
      ([_, item]) => item["x-isModel"]
    );
    // const modelKey = Object.keys(definitions)[0];
    // const model = definitions[modelKey];
    // console.log(modelKey);
    // console.log(model);

    ejs.renderFile(
      path.join(
        __dirname,
        "tmp",
        boilerplateName,
        "swagger",
        "template",
        "model.ejs"
      ),
      { definitions, modelKey, model, dataFormats },
      function(err, str) {
        if (err) {
          console.log(err);
          event.sender.send("generate-boilerplate-err", err);
        } else {
          console.log("----1----");
          console.log(str);
          console.log("----2----");
          try {
            const formatStr = prettier.format(str, {
              semi: true,
              trailingComma: "es5",
              parser: "babel",
            });
            console.log(formatStr);
            event.sender.send("generate-boilerplate-ok", formatStr);
          } catch (err) {
            console.log("格式化失败");
            console.log(err);
            event.sender.send("generate-boilerplate-err", err);
          }
        }
      }
    );
  }
);
