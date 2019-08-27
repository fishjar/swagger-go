import logger from '../utils/logger';

export default () => async function reqBodyLog(ctx, next) {
  // 记录请求的body信息
  logger.info(`req body ${JSON.stringify(ctx.request.body)}`);
  await next();
}
