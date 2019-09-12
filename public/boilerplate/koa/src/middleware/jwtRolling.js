import jwt from "../utils/jwt";
import logger from "../utils/logger";
import model from "../model";

export default () =>
  async function jwtRolling(ctx, next) {
    ctx.state.roles = [];
    const token = ctx.header.authorization;
    if (token) {
      const { authType, authName, userId } = jwt.parseToken(token);
      if (authType && authName && userId) {
        // 将会话信息挂载到ctx.state
        ctx.state.foo = "bar";
        // 角色信息
        const user = await model.User.findByPk(userId);
        ctx.assert(user, 401, "token用户不存在");
        try {
          const roles = await user.getRoles();
          ctx.state.roles = roles.map(role => role.name);
        } catch (err) {
          logger.error(
            `[角色错误] ${JSON.stringify({
              auth: { authType, authName, userId },
              err: err.message || err,
            })}`
          );
        }
        // 生成新token，并写入header
        const newToken = jwt.makeToken({ authType, authName, userId });
        ctx.set("authToken", newToken);
      }
    }
    await next();
  };
