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
    ipcRenderer.on("open-file-err", event => {
      reject(new Error("打开文件失败或已取消"));
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
    ipcRenderer.on("save-file-err", event => {
      reject(new Error("保存文件失败或已取消"));
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

/**
 * 读取缓存数据
 */
export const readCache = () => {
  return new Promise((resolve, reject) => {
    ipcRenderer.send("read-cache");
    ipcRenderer.on("read-cache-ok", (event, data) => {
      try {
        resolve(yaml.safeLoad(data));
      } catch (err) {
        console.log(err);
        reject(new Error("解析缓存数据错误"));
      }
    });
    ipcRenderer.on("read-cache-err", (event, err) => {
      console.log(err);
      reject(new Error("读取缓存数据错误"));
    });
  });
};

/**
 * 写入缓存数据
 * @param {Object} data
 */
export const writeCache = data => {
  return new Promise((resolve, reject) => {
    ipcRenderer.send("write-cache", yaml.dump(data));
    ipcRenderer.on("write-cache-ok", event => {
      resolve(new Error("写入缓存数据成功"));
    });
    ipcRenderer.on("write-cache-err", (event, err) => {
      console.log(err);
      reject(new Error("写入缓存数据错误"));
    });
  });
};

/**
 * 写入浏览器缓存
 * @param {String} key
 * @param {*} data
 */
export const writeLocalStorage = (key, data) => {
  if (!key) {
    return;
  }
  if (data !== null && typeof data === "object") {
    localStorage.setItem(key, JSON.stringify(data));
    return;
  }
  localStorage.setItem(key, data || "");
};

/**
 * 读取浏览器缓存
 * @param {String} key
 */
export const readLocalStorage = key => {
  if (!key) {
    return null;
  }
  const data = localStorage.getItem(key);
  if (!data) {
    return null;
  }
  try {
    return JSON.parse(data);
  } catch (err) {
    console.log(err);
  }
  return data;
};

/**
 * 深度拷贝一个对象
 * @param {*} o
 */
export function deepClone(o) {
  return JSON.parse(JSON.stringify(o));
}

/**
 * 获取数据类型
 * @param {*} o
 */
export const getType = o => {
  const s = Object.prototype.toString.call(o);
  return s.match(/\[object (.*?)\]/)[1].toLowerCase();
};

/**
 * 判断是否对象，且非空
 * @param {*} o
 */
export const isNonNullObj = o => {
  if (getType(o) !== "object") {
    return false;
  }
  if (Object.keys(o).length === 0) {
    return false;
  }
  return true;
};

/**
 * 获取一个模型对象的简单属性列表
 * @param {Object} model
 */
export const getModelProps = model => {
  if (!model || !model.properties) {
    return [];
  }
  return Object.keys(model.properties).map(key => ({
    key,
    type: model.properties[key].type,
    description: model.properties[key].description,
    example:
      model.properties[key].example ||
      (model.example && model.example[key] && model.example[key].toString()),
  }));
};

/**
 * 根据ref链接获取模型及模型字段列表
 * @param {Array} models
 * @param {String} ref
 */
export const parseRef = (models, ref) => {
  if (!ref || models.length < 1) {
    return [{}, []];
  }
  const refModel =
    models.find(item => item.key === ref.replace("#/definitions/", "")) || {};
  const refFields = getModelProps(refModel);
  return [refModel, refFields];
};

/**
 * 判断数组是否有重复值
 * @param {Array} a
 */
export const hasDuplication = a => a.length !== [...new Set(a)].length;

/**
 * 过滤对象
 * 返回对象和参数是同一个
 * @param {Object} o
 * @param {*} value
 */
export const filterObjectItems = (o, value = undefined) => {
  getType(o) === "object" &&
    Object.entries(o).forEach(([k, v]) => {
      if (v === value) {
        delete o[k];
      }
    });
};

/**
 * 过滤数组
 * 返回新数组
 * @param {Array} a
 * @param {*} value
 */
export const filterArrayItems1 = (a, value) => a.filter(item => item !== value);

/**
 * 过滤数组
 * @param {Array} a
 * @param {*} value
 */
export const filterArrayItems2 = (a, value) => {
  const i = a.indexOf(value);
  if (i !== -1) {
    a.splice(i, 1);
  }
};

/**
 * 将对象列表转为对象
 * @param {Array} a
 * @param {String} key
 */
export const parseArrayToObject = (a, key = "key") => {
  if (!Array.isArray(a) || a.length < 1) {
    return {};
  }
  const o = {};
  a.forEach(({ [key]: k, ...data }, i) => {
    filterObjectItems(data);
    o[k || i] = data;
  });
  return o;
};
