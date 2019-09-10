import logger from "../utils/logger";

export default () =>
  async function reqBodyLog(ctx, next) {
    // 记录请求的body信息
    logger.info(
      `[请求的body信息] ${JSON.stringify({
        auth: ctx.state.user,
        body: ctx.request.body,
      })}`
    );
    await next();
  };
