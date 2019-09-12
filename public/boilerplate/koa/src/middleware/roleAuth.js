/**
 * 角色权限中间件
 * @param {Array} roles
 */
export default (roles = []) => (ctx, next) => {
  roles.forEach(role => {
    ctx.assert(
      ctx.state &&
        ctx.state.roles &&
        Array.isArray(ctx.state.roles) &&
        ctx.state.roles.includes(role),
      401,
      "角色缺少权限"
    );
  });
  return next();
};
