import model from "../model";
import jwt from "../utils/jwt";
import sign from "../utils/sign";
import logger from "../utils/logger";

/**
 * 帐号密码登录
 * @param {*} ctx
 * @param {*} next
 */
const account = async (ctx, next) => {
  const { username: authName, password } = ctx.request.body;

  ctx.assert(authName && password, 401, "缺少参数");

  const authType = "account";
  const authCode = sign.signPwd(authName, password);
  const auth = await model.Auth.findOne({
    where: { authType, authName, authCode },
  });

  ctx.assert(auth, 401, "用户名或密码错误");
  ctx.assert(auth.isEnabled, 401, "此帐号已禁用");
  ctx.assert(
    !(auth.expireTime && new Date(auth.expireTime).getTime() < Date.now()),
    401,
    "此帐号已过期"
  );

  const { userId } = auth;
  const authToken = jwt.makeToken({
    authType,
    authName,
    userId,
  });
  ctx.body = {
    message: "登录成功",
    authToken,
  };

  await next();
};

/**
 * 手机登录
 * @param {*} ctx
 * @param {*} next
 */
const phone = async (ctx, next) => {
  // ...
  await next();
};

/**
 * 微信登录
 * @param {*} ctx
 * @param {*} next
 */
const wechat = async (ctx, next) => {
  // ...
  await next();
};

export default {
  account,
  phone,
  wechat,
};
