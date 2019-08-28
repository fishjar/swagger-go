import model from "../model";
import jwt from "../utils/jwt";
import sign from "../utils/sign";

/**
 * 登录
 */
const login = async (ctx, next) => {
  const { userName, userType, password } = ctx.request.body;

  if (!userName || !userType || !password) {
    ctx.throw(401, "缺少参数");
  }

  const pwd = sign.signPwd({
    userName,
    password
  });
  const user = await model.User.findOne({
    where: { userName, userType, password: pwd }
  });
  if (!user) {
    ctx.throw(401, "用户名或密码错误");
  }

  const authtoken = jwt.makeToken({ userName, userType });
  ctx.body = {
    message: "登录成功",
    authtoken
  };

  await next();
};

export default {
  login
};
