import jwt from "jsonwebtoken";
import logger from "./logger";
import config from "../config";
const { JWT_SECRET, JWT_EXPIRES_IN } = config;

/**
 * 加密令牌
 * @param {string} userName 用户名
 * @param {string} userType 用户类型
 */
const makeToken = ({ userName, userType }) => {
  if (!userName || !userType) {
    return "";
  }
  return jwt.sign(
    {
      userName,
      userType
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

/**
 * 解密令牌
 * @param {string} token 认证令牌
 */
const parseToken = token => {
  try {
    return jwt.verify(token.split(" ")[1], JWT_SECRET);
  } catch (err) {
    logger.error(`解析token出错：${JSON.stringify(err)}`);
    return {};
  }
};

export default {
  makeToken,
  parseToken
};
