import yaml from "js-yaml";

const { ipcRenderer } = window.electron;

/**
 * 文件解析
 * @param {File} file
 */
export const parseFile = file => {
  return new Promise((resolve, reject) => {
    // https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader
    const fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onload = event => {
      try {
        if (file.type === "application/x-yaml") {
          resolve(yaml.safeLoad(event.target.result));
        } else if (file.type === "application/json") {
          resolve(JSON.parse(event.target.result));
        } else {
          reject(new Error("文件格式不支持"));
        }
      } catch (err) {
        console.log(err);
        reject(new Error("文件解析错误"));
      }
    };
    fileReader.onerror = err => {
      console.log(err);
      reject(new Error("文件读取错误"));
    };
  });
};

/**
 * 打开文件
 */
export const openFile = () => {
  return new Promise((resolve, reject) => {
    ipcRenderer.send("open-file-dialog");
    ipcRenderer.on("open-file-ok", (event, filePaths) => {
      resolve(filePaths[0]);
    });
    ipcRenderer.on("open-file-err", (event) => {
      reject(new Error("打开文件失败或已取消"))
    });
  });
};

/**
 * 读取文件
 * @param {String} filePath
 */
export const readFile = filePath => {
  return new Promise((resolve, reject) => {
    ipcRenderer.send("read-file", filePath);
    ipcRenderer.on("read-file-ok", (event, data) => {
      try {
        if (filePath.endsWith(".yaml") || filePath.endsWith(".yml")) {
          resolve(yaml.safeLoad(data));
        } else if (filePath.endsWith(".json")) {
          resolve(JSON.parse(data));
        } else {
          resolve(data);
        }
      } catch (err) {
        console.log(err);
        reject(new Error("数据解析错误"));
      }
    });
    ipcRenderer.on("read-file-err", (event, err) => {
      console.log(err);
      reject(new Error("读取文件错误"));
    });
  });
};

/**
 * 打开并读取文件
 */
export const openAndReadFile = () => {
  return openFile().then(filePath => {
    return readFile(filePath);
  });
};

/**
 * 保存文件
 */
export const saveFile = () => {
  return new Promise((resolve, reject) => {
    ipcRenderer.send("save-file-dialog");
    ipcRenderer.on("save-file-ok", (event, filePath) => {
      resolve(filePath);
    });
    ipcRenderer.on("save-file-err", (event) => {
      reject(new Error("保存文件失败或已取消"))
    });
  });
};

/**
 * 写入文件
 * @param {String} filePath
 * @param {String} data
 */
export const writeFile = (filePath, data) => {
  return new Promise((resolve, reject) => {
    ipcRenderer.send("write-file", filePath, data || "");
    ipcRenderer.on("write-file-ok", event => {
      resolve("写入文件成功");
    });
    ipcRenderer.on("write-file-err", (event, err) => {
      console.log(err);
      reject(new Error("写入文件错误"));
    });
  });
};

/**
 * 保存并写入文件
 * @param {String|Object} data
 */
export const saveAndWriteFile = data => {
  return saveFile().then(filePath => {
    if (data !== null && typeof data === "object") {
      if (filePath.endsWith(".yaml") || filePath.endsWith(".yml")) {
        return writeFile(filePath, yaml.dump(data));
      } else if (filePath.endsWith(".json")) {
        return writeFile(filePath, JSON.stringify(data, null, "\t"));
      }
      return writeFile(filePath, data.toString());
    }
    return writeFile(filePath, data);
  });
};

/**
 * 读取默认数据
 */
export const readDefaultData = () => {
  return new Promise((resolve, reject) => {
    ipcRenderer.send("read-default-data");
    ipcRenderer.on("read-default-data-ok", (event, data) => {
      try {
        resolve(yaml.safeLoad(data));
      } catch (err) {
        console.log(err);
        reject(new Error("解析默认数据错误"));
      }
    });
    ipcRenderer.on("read-default-data-err", (event, err) => {
      console.log(err);
      reject(new Error("读取默认数据错误"));
    });
  });
};
