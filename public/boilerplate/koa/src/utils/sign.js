import crypto from "crypto";
import config from "../config";

/**
 * 加密用户密码
 * @param {string} username 用户名
 * @param {string} password 密码
 */
const signPwd = (username, password) => {
  const { PWD_SALT } = config;
  const sign = crypto
    .createHash("md5")
    .update(username)
    .update(password)
    .update(password)
    .update(PWD_SALT)
    .update(PWD_SALT)
    .update(PWD_SALT)
    .digest("hex");
  return sign;
};

export default {
  signPwd,
};
