import jwt from "../utils/jwt";
import model from "../model";

export default () =>
  async function jwtRolling(ctx, next) {
    // 忽略登录请求
    if (ctx.request.url && ctx.request.url.startsWith("/login/")) {
      await next();
      return;
    }

    const token = ctx.header.authorization;
    ctx.assert(token, 401, "缺少token");

    // 解密token信息
    // const { authId, authType, authName } = ctx.state.user;
    const { authId, authType, authName } = jwt.parseToken(token);
    ctx.assert(authId && authType && authName, 401, "tokeni信息有误");

    // 查找并验证帐号信息
    const auth = await model.Auth.findByPk(authId, {
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
    ctx.assert(auth, 401, "帐号不存在");
    ctx.assert(auth.isEnabled, 401, "帐号停用");
    ctx.assert(auth.user, 401, "帐号异常");

    // 挂载最新角色信息
    ctx.state.roles = auth.user.roles.map(role => role.name);

    // 生成新token，并写入header
    const newToken = jwt.makeToken({ authId, authType, authName });
    ctx.set("authToken", newToken);

    await next();
  };
