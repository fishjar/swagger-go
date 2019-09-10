import model from "../model";
import sequelize from "../db";
import { fetchTest } from "../utils/api";

/**
 * 测试请求网络数据
 * @param {*} ctx
 * @param {*} next
 */
const fetch = async (ctx, next) => {
  const res = await fetchTest();
  ctx.assert(res, 500, "未获取到数据");
  ctx.body = res;

  next();
};

/**
 * 测试事务
 * @param {*} ctx
 * @param {*} next
 */
const createAuth = async (ctx, next) => {
  const t = await sequelize.transaction();
  const user = await model.User.create(
    { name: "testname" },
    { transaction: t }
  );
  const auth = await model.Auth.create(
    {
      userId: user.id,
      authType: "account",
      // authName: "testname",
    },
    { transaction: t }
  );
  ctx.body = auth;

  next();
};

const queryRaw = async (ctx, next) => {
  const res = await sequelize.query("SELECT * FROM `user`", {
    // type: sequelize.QueryTypes.SELECT,
    model: model.User,
    mapToModel: true,
  });
  ctx.body = res;

  next();
};

export default {
  fetch,
  createAuth,
  queryRaw,
};
