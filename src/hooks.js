import { useState, useEffect, useReducer } from "react";
import { readFile } from "./utils";

/**
 * 数据reducer
 * https://zh-hans.reactjs.org/docs/hooks-custom.html
 * @param {Object} state
 * @param {Object} action
 */
const dataUploadReducer = (state, action) => {
  switch (action.type) {
    case "UPLOAD_INIT":
      return { ...state, isLoading: true, isError: false, errorMsg: "" };
    case "UPLOAD_SUCCESS":
      return {
        ...state,
        isLoading: false,
        data: action.payload
      };
    case "UPLOAD_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
        errorMsg: action.payload
      };
    case "NEW_DATA":
      return {
        isLoading: false,
        isError: false,
        errorMsg: "",
        data: {
          swagger: "2.0",
          info: {
            version: "0.1.0",
            title: "new app"
          },
          host: "localhost:3000",
          basePath: "/",
          schemes: ["http", "https"],
          consumes: ["application/json"],
          produces: ["application/json"],
          securityDefinitions: {
            JWT: {
              description: "Authorization: Bearer {token}",
              in: "header",
              name: "Authorization",
              type: "apiKey"
            }
          },
          security: {
            JWT: []
          }
        }
      };
    default:
      return state;
  }
};

/**
 * 数据上传自定义hook
 * https://zh-hans.reactjs.org/docs/hooks-custom.html
 */
export const useDataUpload = () => {
  const [file, setFile] = useState(null);

  const [state, dispatch] = useReducer(dataUploadReducer, {
    isLoading: false,
    isError: false,
    errorMsg: "",
    data: null
  });

  useEffect(() => {
    const readData = async () => {
      dispatch({ type: "UPLOAD_INIT" });
      try {
        const data = await readFile(file);
        dispatch({ type: "UPLOAD_SUCCESS", payload: data });
      } catch (error) {
        dispatch({
          type: "UPLOAD_FAILURE",
          payload: error.message || "文件上传失败"
        });
      }
    };
    file && readData();
  }, [file]);

  return [state, setFile, dispatch];
};
