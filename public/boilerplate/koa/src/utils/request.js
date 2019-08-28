import rp from "request-promise";
import logger from "./logger";

export default async options => {
  let res;
  try {
    res =
      (await rp({
        json: true,
        ...options
      })) || "ok";
  } catch ({ name, statusCode, message, options }) {
    logger.error(`${name} ${statusCode} ${message} ${JSON.stringify(options)}`);
    // const err = new Error('服务请求错误');
    // err.status = err.statusCode;
    // throw err;
  }
  return res;
};
