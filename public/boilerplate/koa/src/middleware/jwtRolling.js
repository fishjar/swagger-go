import jwt from "../utils/jwt";

export default () =>
  async function jwtRolling(ctx, next) {
    const token = ctx.header.authorization;
    if (token) {
      const { authType, authName, userId } = jwt.parseToken(token);
      if (authType && authName && userId) {
        // 将会话信息挂载到ctx.state
        ctx.state.foo = "bar";
        // 生成新token，并写入header
        const newToken = jwt.makeToken({ authType, authName, userId });
        ctx.set("authToken", newToken);
      }
    }
    await next();
  };
