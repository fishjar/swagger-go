import logger from '../utils/logger';

export default () => async function errorHandler (ctx, next) {
  try {
    // 记录request信息
    logger.info(`--> ${ctx.method} ${ctx.href} from ${ctx.ip} ${JSON.stringify(ctx.headers)}`);
    await next();
    // 记录response信息
    logger.info(`res body ${(typeof ctx.body === 'string') ? ctx.body : JSON.stringify(ctx.body)}`);
  } catch (err) {
    ctx.status = err.statusCode || 500
    ctx.body = err.toJSON ? err.toJSON() : { message: err.message, ...err }
    // 记录错误信息
    logger.error(`error info ${JSON.stringify(err)}`);
  }
}
