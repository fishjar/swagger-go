import path from "path";
import developmentConfig from "./config.development";
import testConfig from "./config.test";
import productionConfig from "./config.production";

// 运行环境
const NODE_ENV = process.env.NODE_ENV || "development";

// 默认配置
const defaultConfig = {
  BASE_PATH: path.resolve(__dirname, "../"), // 项目所在目录
  NODE_ENV,
  NODE_PORT: process.env.NODE_PORT || "3000", // 运行端口
  DEFAULT_USERNAME: process.env.DEFAULT_USERNAME || "gabe", // 默认用户名
  DEFAULT_USERTYPE: process.env.DEFAULT_USERTYPE || "admin", // 默认用户类型
  DEFAULT_PASSWORD: process.env.DEFAULT_PASSWORD || "123456", // 默认用户密码
  JWT_SECRET: process.env.JWT_SECRET || "123456", // JWT加密密钥
  JWT_EXPIRES_IN: "1h", // JWT过期时间
  PWD_SALT: process.env.PWD_SALT || "123456", // 密码盐
  LOG_LEVEL: "debug" // 最低日志级别
};

// 运行环境配置
const configMap = {
  development: developmentConfig, // 开发环境配置
  test: testConfig, // 测试环境配置
  production: productionConfig // 生产环境配置
};

// 合并配置
const config = { ...defaultConfig, ...configMap[NODE_ENV] };

export default config;
