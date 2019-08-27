import path from "path";
import winston from "winston";
import "winston-daily-rotate-file";

import config from "../config";
const { BASE_PATH, LOG_LEVEL } = config;

const LOG_PATH = path.join(BASE_PATH, "log");
const errorLogPath = path.join(LOG_PATH, `%DATE%.error.log`);
const infoLogPath = path.join(LOG_PATH, `%DATE%.info.log`);
const debugLogPath = path.join(LOG_PATH, `%DATE%.debug.log`);

const { combine, timestamp, label, printf } = winston.format;
// 自定义日志格式
const myFormat = printf(
  info => `${info.timestamp} [${info.level}]: ${info.message}`
);

// 日志记录器
const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: combine(timestamp(), myFormat),
  transports: [
    new winston.transports.DailyRotateFile({
      filename: errorLogPath,
      level: "error"
    }),
    new winston.transports.DailyRotateFile({
      filename: infoLogPath,
      level: "info"
    }),
    new winston.transports.DailyRotateFile({ filename: debugLogPath })
  ]
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple()
    })
  );
}

export default logger;
