import yaml from "js-yaml";

/**
 * 文件读取
 * @param {File} file
 */
export const readFile = file => {
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
      } catch (error) {
        console.log(error);
        reject(new Error("文件解析错误"));
      }
    };
    fileReader.onerror = error => {
      console.log(error);
      reject(new Error("文件读取错误"));
    };
  });
};
