import { useState, useEffect, useReducer } from "react";
import { message } from "antd";
import {
  openAndReadFile,
  saveAndWriteFile,
  readDefaultData, // demo数据
  writeLocalStorage,
  readLocalStorage, // 缓存数据
  downloadBoilerplate,
  generateBoilerplate,
} from "./utils";
import { dataFormats } from "./config";
import definitionsToPaths from "./utils/definitionsToPaths";

/**
 * 初始化state
 * @param {String} key
 */
const init = key => {
  const state = readLocalStorage(key);
  return state;
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
    case "DATA_NEW":
      return {
        swagger: "2.0",
        info: {},
        securityDefinitions: {},
        paths: {},
        definitions: {},
      };
    case "DATA_RESET":
      return {
        ...action.payload,
      };
    case "DATA_UPDATE":
      return {
        ...state,
        ...action.payload,
      };
    case "MODEL_UPDATE":
      return {
        ...state,
        definitions: {
          ...state.definitions,
          ...action.payload,
        },
      };
    case "MODEL_RESET":
      return {
        ...state,
        definitions: { ...action.payload },
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
  const [isUndo, setUndo] = useState(false);
  const [isRedo, setRedo] = useState(false);
  const [page, setPage] = useState("edit");
  const [showCode, setShowCode] = useState(false);
  const [current, setCurrent] = useState(0);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isClose, setClose] = useState(false);
  const [isTest, setTest] = useState(false);

  const [state, dispatch] = useReducer(dataReducer, "state", init);

  useEffect(() => {
    if (page === "preview") {
      const apiPaths = definitionsToPaths(state && state.definitions);
      dispatch({
        type: "DATA_UPDATE",
        payload: {
          paths: {
            ...state.paths,
            ...apiPaths,
          },
        },
      });
    }
  }, [page]);

  useEffect(() => {
    const loadFile = async () => {
      try {
        const data = await openAndReadFile();
        if (data.swagger === "2.0") {
          dispatch({ type: "DATA_RESET", payload: data });
          message.success("文件上传成功");
        } else {
          message.error("导入失败！仅支持swagger2.0版本");
        }
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
  }, [isSaving]);

  useEffect(() => {
    // const downloadFiles = async () => {
    //   try {
    //     await downloadBoilerplate(state);
    //     message.success("下载成功");
    //   } catch (err) {
    //     message.error(err.message || "下载失败");
    //   } finally {
    //     setTest(false);
    //   }
    // };
    // isTest && downloadFiles();

    const generateFiles = async () => {
      try {
        await generateBoilerplate({
          definitions: state.definitions,
          dataFormats,
        });
        message.success("生成成功");
      } catch (err) {
        message.error(err.message || "生成失败");
      } finally {
        setTest(false);
      }
    };
    isTest && generateFiles();
  }, [isTest]);

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

        const history = readLocalStorage("history");
        if (state === null) {
          writeLocalStorage("history", [null]);
          setCurrent(0);
          setUndo(false);
          setRedo(false);
        } else if (isUndo) {
          setCurrent(current - 1);
          setUndo(false);
        } else if (isRedo) {
          setCurrent(current + 1);
          setRedo(false);
        } else {
          const lastHistory = history[current];
          if (JSON.stringify(lastHistory) !== JSON.stringify(state)) {
            writeLocalStorage("history", [
              ...history.slice(0, current + 1),
              state,
            ]);
            setCurrent(current + 1);
          }
        }
      } catch (err) {
        message.error(err.message || "写入缓存失败");
      }
    };
    saveCache();
  }, [state]);

  useEffect(() => {
    if (isUndo) {
      const history = readLocalStorage("history");
      if (current > 0) {
        if (history[current - 1] === null) {
          dispatch({ type: "DATA_INIT" });
        } else {
          dispatch({
            type: "DATA_RESET",
            payload: history[current - 1],
          });
        }
      } else {
        setUndo(false);
      }
    }
  }, [isUndo]);

  useEffect(() => {
    if (isRedo) {
      const history = readLocalStorage("history");
      if (current < history.length - 1) {
        dispatch({
          type: "DATA_RESET",
          payload: history[current + 1],
        });
      } else {
        setRedo(false);
      }
    }
  }, [isRedo]);

  useEffect(() => {
    const history = readLocalStorage("history");
    if (current > 1) {
      setCanUndo(true);
    } else {
      setCanUndo(false);
    }
    if (history && current < history.length - 1) {
      setCanRedo(true);
    } else {
      setCanRedo(false);
    }
  }, [current]);

  useEffect(() => {
    if (isClose) {
      dispatch({ type: "DATA_INIT" });
      setClose(false);
    }
  }, [isClose]);

  return {
    state,
    isLoading,
    isSaving,
    isResetting,
    setLoading,
    setSaving,
    setResetting,
    page,
    setPage,
    showCode,
    setShowCode,
    dispatch,
    isUndo,
    setUndo,
    isRedo,
    setRedo,
    canUndo,
    canRedo,
    isClose,
    setClose,
    current,
    isTest,
    setTest,
  };
};
