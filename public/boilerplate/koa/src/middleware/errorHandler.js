import logger from "../utils/logger";

export default () =>
  async function errorHandler(ctx, next) {
    try {
      // 记录request信息
      logger.info(
        `[请求信息] ${JSON.stringify({
          method: ctx.method,
          href: ctx.href,
          ip: ctx.ip,
          headers: ctx.headers,
        })}`
      );

      await next();

      // 记录response信息
      logger.info(
        `[返回信息] ${JSON.stringify({
          auth: ctx.state.user,
          body: ctx.body,
        })}`
      );
    } catch (err) {
      // 记录错误信息
      logger.error(
        `[全局错误] ${JSON.stringify({
          auth: ctx.state.user,
          err: err.toJSON ? err.toJSON() : err,
        })}`
      );

      ctx.status = err.statusCode || 500;
      ctx.body = { message: err.message || "服务器错误" };
      // ctx.body = err.toJSON ? err.toJSON() : { message: err.message, ...err };
    }
  };
