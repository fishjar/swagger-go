import { useState, useEffect, useReducer } from "react";
import { openAndReadFile, saveAndWriteFile, readDefaultData } from "./utils";

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
        ...action.payload
      };
    case "DATA_UPDATE":
      return {
        ...(state || {}),
        ...action.payload
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
  const [msgs, setMsgs] = useState([]);

  const [state, dispatch] = useReducer(dataReducer, null);

  useEffect(() => {
    const loadFile = async () => {
      try {
        const data = await openAndReadFile();
        dispatch({ type: "DATA_RESET", payload: data });
        setMsgs([...msgs, "文件上传成功"]);
      } catch (err) {
        setMsgs([...msgs, err.message || "文件上传失败"]);
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
        setMsgs([...msgs, "文件保存成功"]);
      } catch (err) {
        setMsgs([...msgs, err.message || "文件保存失败"]);
      } finally {
        setSaving(false);
      }
    };
    isSaving && saveFile();
  }, [isSaving]);

  useEffect(() => {
    const resetData = async () => {
      try {
        const data = await readDefaultData(state);
        dispatch({ type: "DATA_RESET", payload: data });
        setMsgs([...msgs, "数据重置成功"]);
      } catch (err) {
        setMsgs([...msgs, err.message || "数据重置失败"]);
      } finally {
        setResetting(false);
      }
    };
    isResetting && resetData();
  }, [isResetting]);

  return {
    state,
    msgs,
    isLoading,
    isSaving,
    isResetting,
    setLoading,
    setSaving,
    setResetting,
    setMsgs,
    dispatch
  };
};
