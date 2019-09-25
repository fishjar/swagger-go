const path = require("path");
const fs = require("fs");
const { ipcMain, dialog } = require("electron");
const downloadRepo = require("download-git-repo");
const ejs = require("ejs");
const prettier = require("prettier");
const archiver = require("archiver");
const fse = require("fs-extra");

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
 * 监听打开文件夹
 */
ipcMain.on("open-path-dialog", event => {
  dialog.showOpenDialog(
    {
      title: "请选择一个文件",
      properties: ["openDirectory"],
    },
    filePaths => {
      if (filePaths) {
        event.sender.send("open-path-ok", filePaths);
      } else {
        event.sender.send("open-path-err");
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
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      event.sender.send("read-default-data-err", err);
    } else {
      event.sender.send("read-default-data-ok", data);
    }
  });
});

/**
 * 监听读取README
 */
ipcMain.on("read-readme", event => {
  const filePath = path.join(__dirname, "README.md");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      event.sender.send("read-readme-err", err);
    } else {
      event.sender.send("read-readme-ok", data);
    }
  });
});

/**
 * 监听读取缓存数据
 */
ipcMain.on("read-cache", event => {
  const filePath = path.join(__dirname, "cache.yaml");
  fs.readFile(filePath, "utf8", (err, data) => {
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

/**
 * 下载样板文件
 */
ipcMain.on(
  "download-boilerplate",
  (
    event,
    boilerplateName,
    repoUrl,
    repoBranch = "master",
    targetDir = "download"
  ) => {
    const localDir = path.join(__dirname, targetDir, boilerplateName);
    fse
      .emptyDir(localDir)
      .then(() => {
        downloadRepo(`${repoUrl}#${repoBranch}`, localDir, err => {
          if (err) {
            event.sender.send("download-boilerplate-err", err);
          } else {
            event.sender.send("download-boilerplate-ok");
          }
        });
      })
      .catch(err => {
        console.log(err);
        event.sender.send(
          "download-boilerplate-err",
          new Error("清空文件夹出错")
        );
      });
  }
);

/**
 * 生成样板文件
 */
ipcMain.on(
  "generate-boilerplate",
  (
    event,
    boilerplateName,
    {
      definitions,
      dataFormats,
      sourceType = "defaultLocal",
      sourceDir,
      yamlData,
      associations = [],
    }
  ) => {
    const modelKeys = Object.keys(definitions).filter(
      key => definitions[key]["x-isModel"]
    );
    // 默认样板
    if (sourceType === "defaultLocal") {
      sourceDir = path.join(__dirname, "boilerplate", boilerplateName);
    }
    // 在线下载的样板
    if (sourceType === "defaultOnline" || sourceType === "customOnline") {
      sourceDir = path.join(__dirname, "download", boilerplateName);
    }
    if (!sourceDir) {
      event.sender.send(
        "generate-boilerplate-err",
        new Error("缺少样本来源目录")
      );
      return;
    }
    const tmpDir = path.join(__dirname, "tmp", boilerplateName);
    const swaggerConfig = require(path.join(
      sourceDir,
      "swagger",
      "config.json"
    ));
    const {
      globalFiles = [],
      modelFiles = [],
      replaceFiles = [],
      removeFiles = [],
      boilerplateLanguage,
      templateEngine,
    } = swaggerConfig;

    /**
     * 格式化文件
     * @param {*} str
     */
    const strFormat = str => {
      try {
        if (
          ["js", "javascript", "node", "nodejs"].includes(boilerplateLanguage)
        ) {
          str = prettier.format(str, {
            semi: true,
            trailingComma: "es5",
            parser: "babel",
          });
        }
      } catch (err) {
        console.log("格式化失败");
        console.log(err);
      }
      return str;
    };

    /**
     * 渲染模板
     * @param {*} templateFile
     * @param {*} data
     */
    const renderPromise = (templateFile, data) => {
      return new Promise((resolve, reject) => {
        if (templateEngine === "ejs") {
          ejs.renderFile(templateFile, data, function(err, str) {
            if (err) {
              console.log("渲染失败");
              console.log(err);
              reject(err);
            } else {
              // console.log(str);
              resolve(strFormat(str));
            }
          });
        } else {
          throw new Error(`不支持的模板引擎: ${templateEngine}`);
        }
      });
    };

    /**
     * 删除 -> 渲染 -> 生成
     * @param {*} templateFile
     * @param {*} outFile
     * @param {*} data
     */
    const doPromise = (templateFile, outFile, data) => {
      return fse
        .remove(outFile)
        .then(() => {
          console.log("删除成功", outFile);
          return renderPromise(templateFile, data);
        })
        .then(fileStr => {
          console.log("渲染成功", outFile);
          return fse.outputFile(outFile, fileStr);
        });
    };

    fse
      .emptyDir(tmpDir)
      .then(() => {
        console.log("已清空文件夹", tmpDir);
        return fse.copy(sourceDir, tmpDir);
      })
      .then(() => {
        console.log("拷贝文件夹成功");
        return Promise.all(
          removeFiles.map(item => {
            const rmFile = path.join(tmpDir, item);
            return fse.remove(rmFile);
          })
        );
      })
      .then(() => {
        console.log("删除文件成功");
        return Promise.all(
          replaceFiles.map(item => {
            const placeFile = path.join(tmpDir, item[0]);
            const outFile = path.join(tmpDir, item[1]);
            return fse.copy(placeFile, outFile);
          })
        );
      })
      .then(() => {
        console.log("拷贝替换文件成功");
        return fse.outputFile(
          path.join(tmpDir, "swagger", "swagger.yaml"),
          yamlData
        );
      })
      .then(() => {
        console.log("生成swagger文件成功");
        return Promise.all(
          globalFiles.map(item => {
            const inFile = path.join(tmpDir, item[0]);
            const outFile = path.join(tmpDir, item[1]);
            return doPromise(inFile, outFile, {
              definitions,
              dataFormats,
              associations,
            });
          })
        );
      })
      .then(() => {
        console.log("生成全局文件成功");
        const tasks = [];
        modelKeys.forEach(key => {
          modelFiles.forEach(item => {
            const inFile = path.join(tmpDir, item[0]);
            const outFile = path.join(tmpDir, item[1].replace("*", key));
            tasks.push(
              doPromise(inFile, outFile, {
                modelKey: key,
                model: definitions[key],
                definitions,
                dataFormats,
                associations,
              })
            );
          });
        });
        return Promise.all(tasks);
      })
      .then(() => {
        console.log("生成模型文件成功");
        event.sender.send("generate-boilerplate-ok");
      })
      .catch(err => {
        console.log(err);
        event.sender.send("generate-boilerplate-err", err);
      });
  }
);

/**
 * 打包样板文件
 */
ipcMain.on("archiver-boilerplate", (event, boilerplateName, outDir) => {
  const tmpDir = path.join(__dirname, "tmp", boilerplateName);

  try {
    var output = fs.createWriteStream(
      path.join(outDir, `${boilerplateName}.zip`)
    );
    var archive = archiver("zip", {
      zlib: { level: 9 },
    });

    output.on("close", function() {
      console.log(archive.pointer() + " total bytes");
      console.log("打包成功");
      event.sender.send("archiver-boilerplate-ok");
    });

    output.on("end", function() {
      console.log("Data has been drained");
    });

    archive.on("warning", function(err) {
      console.log("警告", err);
      event.sender.send("archiver-boilerplate-err", err);
      if (err.code === "ENOENT") {
        //
      } else {
        //
      }
    });

    archive.on("error", function(err) {
      console.log("打包失败");
      event.sender.send("archiver-boilerplate-err", err);
    });

    archive.pipe(output);
    archive.directory(tmpDir, boilerplateName);
    archive.finalize();
  } catch (err) {
    console.log("打包错误");
    console.log(err);
    event.sender.send("archiver-boilerplate-err", err);
  }
});

/**
 * 拷贝样板文件
 */
ipcMain.on("copy-boilerplate", (event, boilerplateName, outDir) => {
  const tmpDir = path.join(__dirname, "tmp", boilerplateName);
  fse.copy(tmpDir, path.join(outDir, boilerplateName), err => {
    if (err) {
      console.log("拷贝错误");
      event.sender.send("copy-boilerplate-err", err);
    } else {
      event.sender.send("copy-boilerplate-ok");
    }
  });
});

/**
 * 判断文件/文件夹是否存在
 */
ipcMain.on("path-exists", (event, pathStrs) => {
  const outPath = path.join(...pathStrs);
  fse.pathExists(outPath, (err, exists) => {
    if (err) {
      console.log(err); // => null
      event.sender.send("path-exists-err", err);
    } else {
      event.sender.send("path-exists-ok", exists, outPath);
    }
  });
});

/**
 * 清除缓存文件
 */
ipcMain.on("clear-cache-path", event => {
  const tmpDir = path.join(__dirname, "tmp");
  const downloadDir = path.join(__dirname, "download");
  fse
    .emptyDir(tmpDir)
    .then(() => fse.emptyDir(downloadDir))
    .then(() => {
      event.sender.send("clear-cache-path-ok");
    })
    .catch(err => {
      console.log("清空临时文件夹错误");
      event.sender.send("clear-cache-path-err", err);
    });
});
