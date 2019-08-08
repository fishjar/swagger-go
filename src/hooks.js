import { useState, useEffect, useReducer } from "react";
import { message } from "antd";
import {
  openAndReadFile,
  saveAndWriteFile,
  readDefaultData,
  writeLocalStorage,
  readLocalStorage,
} from "./utils";

/**
 * 初始化state
 * @param {String} key
 */
const init = key => {
  return readLocalStorage(key);
};

/**
 * 数据reducer
 * https://zh-hans.reactjs.org/docs/hooks-custom.html
 * @param {Object} state
 * @param {Object} action
 */
const dataReducer = (state, action) => {
  switch (action.type) {
    case "DATA_INIT":
      return null;
    case "DATA_RESET":
      return {
        ...action.payload,
      };
    case "DATA_UPDATE":
      return {
        ...(state || {}),
        ...action.payload,
      };
    case "FIELD_UPDATE":
      const {
        definitionKey,
        inRequired,
        inExample,
        data: { key, ...data },
      } = action.payload;
      const definition = state.definitions[definitionKey];
      const { example = {}, properties = {}, required = [] } = definition;

      const newExample = { ...example };
      if (inExample) {
        newExample[key] = data.example;
      } else {
        delete newExample[key];
      }

      let newRequired = [...required];
      if (inRequired) {
        newRequired = [...new Set([...newRequired, key])];
      } else {
        newRequired = newRequired.filter(item => item === key);
      }

      const newProperties = { ...properties, [key]: data };

      return {
        ...state,
        definitions: {
          ...state.definitions,
          [definitionKey]: {
            ...state.definitions[definitionKey],
            example: newExample,
            required: newRequired,
            properties: newProperties,
          },
        },
      };

    default:
      return state;
  }
};

/**
 * 数据自定义hook
 * https://zh-hans.reactjs.org/docs/hooks-custom.html
 */
export const useData = () => {
  const [isLoading, setLoading] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [isResetting, setResetting] = useState(false);

  const [state, dispatch] = useReducer(dataReducer, "state", init);

  useEffect(() => {
    const loadFile = async () => {
      try {
        const data = await openAndReadFile();
        dispatch({ type: "DATA_RESET", payload: data });
        message.success("文件上传成功");
      } catch (err) {
        message.error(err.message || "文件上传失败");
      } finally {
        setLoading(false);
      }
    };
    isLoading && loadFile();
  }, [isLoading]);

  useEffect(() => {
    const saveFile = async () => {
      try {
        await saveAndWriteFile(state);
        message.success("文件保存成功");
      } catch (err) {
        message.error(err.message || "文件保存失败");
      } finally {
        setSaving(false);
      }
    };
    isSaving && saveFile();
  }, [state, isSaving]);

  useEffect(() => {
    const resetData = async () => {
      try {
        const data = await readDefaultData();
        dispatch({ type: "DATA_RESET", payload: data });
        message.success("数据重置成功");
      } catch (err) {
        message.error(err.message || "数据重置失败");
      } finally {
        setResetting(false);
      }
    };
    isResetting && resetData();
  }, [isResetting]);

  useEffect(() => {
    const saveCache = () => {
      try {
        // await writeCache(state);
        writeLocalStorage("state", state);
        message.success("写入缓存成功");
      } catch (err) {
        message.error(err.message || "写入缓存失败");
      }
    };
    saveCache();
  }, [state]);

  return {
    state,
    isLoading,
    isSaving,
    isResetting,
    setLoading,
    setSaving,
    setResetting,
    dispatch,
  };
};
