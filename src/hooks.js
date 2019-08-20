import { useState, useEffect, useReducer } from "react";
import { message } from "antd";
import {
  openAndReadFile,
  saveAndWriteFile,
  readDefaultData, // demo数据
  writeLocalStorage,
  readLocalStorage, // 缓存数据
} from "./utils";
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
  }, [isSaving]);

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

        if (state === null) {
          writeLocalStorage("history", [null]);
          setCurrent(0);
        } else {
          const history = readLocalStorage("history");
          if (current === history.length - 1) {
            const lastHistory = history[history.length - 1];
            if (JSON.stringify(lastHistory) !== JSON.stringify(state)) {
              writeLocalStorage("history", [...history, state]);
              setCurrent(history.length);
            }
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
        setCurrent(current - 1);
        if (history[current - 1] === null) {
          dispatch({ type: "DATA_INIT" });
        } else {
          dispatch({
            type: "DATA_RESET",
            payload: history[current - 1],
          });
        }
      }
      setUndo(false);
    }
  }, [isUndo]);

  useEffect(() => {
    if (isRedo) {
      const history = readLocalStorage("history");
      if (current < history.length - 1) {
        setCurrent(current + 1);
        dispatch({
          type: "DATA_RESET",
          payload: history[current + 1],
        });
      }
      setRedo(false);
    }
  }, [isRedo]);

  useEffect(() => {
    const history = readLocalStorage("history");
    if (current > 0) {
      setCanUndo(true);
    } else {
      setCanUndo(false);
    }
    if (current < history.length - 1) {
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
  };
};
