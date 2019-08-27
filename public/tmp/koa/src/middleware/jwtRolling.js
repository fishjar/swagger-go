import jwt from "../utils/jwt";

export default () =>
  async function jwtRolling(ctx, next) {
    const token = ctx.header.authorization;
    if (token) {
      const { userName, userType } = jwt.parseToken(token);
      if (userName && userType) {
        // 将当前登录用户信息挂载到ctx.state
        ctx.state.user = {
          userName,
          userType
        };
        // 生成新token，并写入header
        const newToken = jwt.makeToken({ userName, userType });
        ctx.set("authtoken", newToken);
      }
    }
    await next();
  };
