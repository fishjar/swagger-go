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
  try {
    const { userName: authName, password } = ctx.request.body;

    ctx.assert(authName && password, 401, "缺少参数");

    const authType = "account";
    const authCode = sign.signPwd(authName, password);
    const auth = await model.Auth.findOne({
      where: { authType, authName, authCode },
      include: [
        {
          model: model.User,
          as: "user",
          include: [
            {
              model: model.Role,
              as: "roles",
            },
          ],
        },
      ],
    });

    ctx.assert(auth, 401, "用户名或密码错误");
    ctx.assert(auth.isEnabled, 401, "此帐号已禁用");
    ctx.assert(
      !(auth.expireTime && new Date(auth.expireTime).getTime() < Date.now()),
      401,
      "此帐号已过期"
    );
    ctx.assert(auth.user, 401, "帐号异常");

    const authToken = jwt.makeToken({
      authId: auth.id,
      authType,
      authName,
    });

    ctx.body = {
      status: "ok",
      type: "account",
      message: "登录成功",
      authToken,
      currentAuthority: auth.user.roles.map(role => role.name),
    };
  } catch (err) {
    ctx.body = {
      status: "error",
      type: "account",
      message: err.message || "登录失败",
      currentAuthority: ["guest"],
    };
  }

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
