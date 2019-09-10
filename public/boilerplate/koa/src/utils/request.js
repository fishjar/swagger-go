import rp from "request-promise";
import logger from "./logger";

/**
 * request封装
 */
export default async options => {
  try {
    return await rp({ json: true, ...options });
  } catch ({ name, statusCode, message, options }) {
    logger.error(`[request请求错误] ${JSON.stringify({ name, statusCode, message, options })}`);
    return;
  }
};
