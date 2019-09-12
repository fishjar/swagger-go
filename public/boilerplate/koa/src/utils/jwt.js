import jwt from "jsonwebtoken";
import logger from "./logger";
import config from "../config";
const { JWT_SECRET, JWT_EXPIRES_IN } = config;

/**
 * 加密令牌
 * @param {string} authType 鉴权类型
 * @param {string} authName 鉴权名称
 * @param {UUID} authName 用户ID
 */
const makeToken = ({ authType, authName, userId }) => {
  if (!authType || !authName || !userId) {
    return "";
  }
  return jwt.sign(
    {
      authType,
      authName,
      userId,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

/**
 * 解密令牌
 * @param {string} authToken 认证令牌
 */
const parseToken = authToken => {
  try {
    return jwt.verify(authToken.split(" ")[1], JWT_SECRET);
  } catch (err) {
    logger.error(
      `[解析token出错] ${JSON.stringify({
        authToken,
        err,
      })}`
    );
    return {};
  }
};

export default {
  makeToken,
  parseToken,
};
