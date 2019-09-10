import jwtKoa from "koa-jwt";
import config from "../config";

const { JWT_SECRET } = config;
export default () => jwtKoa({ secret: JWT_SECRET }).unless({ path: [/^\/login/] });
