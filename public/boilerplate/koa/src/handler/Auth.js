import model from "../model";

/**
 * 查询多条信息
 */
const findAndCountAll = async (ctx, next) => {
  const { pageNum = 1, pageSize = 10, sorter, ...where } = ctx.query;
  let order = [];
  if (Array.isArray(sorter)) {
    order = [...sorter.map(item => item.split("__"))];
  } else if (sorter) {
    order = [sorter.split("__")];
  }
  const { count, rows } = await model.Auth.findAndCountAll({
    where,
    offset: (pageNum - 1) * pageSize,
    limit: pageSize,
    order,
    attributes: { exclude: ["authCode"] },
    include: [
      {
        model: model.User,
        as: "user",
        // include: [
        //   {
        //     model: model.Auth,
        //   },
        // ],
      },
    ],
    distinct: true,
  });
  ctx.body = { count, rows };

  next();
};

/**
 * 根据主键查询单条信息
 */
const findByPk = async (ctx, next) => {
  const auth = await model.Auth.findByPk(ctx.params.id);
  ctx.assert(auth, 404, "记录不存在");
  // const user = await model.User.findByPk(auth.userId);
  const user = await auth.getUser();
  ctx.assert(user, 500, "外键记录不存在");
  ctx.body = { ...auth.get({ plain: true }), user };

  next();
};

/**
 * 创建单条信息
 */
const singleCreate = async (ctx, next) => {
  ctx.body = await model.Auth.create(ctx.request.body);

  next();
};

/**
 * 创建多条信息
 */
const bulkCreate = async (ctx, next) => {
  ctx.body = await model.Auth.bulkCreate(ctx.request.body, {
    validate: true,
  });

  next();
};

/**
 * 更新多条信息
 */
const bulkUpdate = async (ctx, next) => {
  ctx.body = await model.Auth.update(ctx.request.body.fields, {
    where: ctx.request.body.filter,
  });

  next();
};

/**
 * 更新单条信息
 */
const updateByPk = async (ctx, next) => {
  const auth = await model.Auth.findByPk(ctx.params.id);
  ctx.assert(auth, 404, "记录不存在");
  ctx.body = await auth.update(ctx.request.body);

  next();
};

/**
 * 删除多条信息
 */
const bulkDestroy = async (ctx, next) => {
  ctx.body = await model.Auth.destroy({
    where: ctx.request.body,
  });

  next();
};

/**
 * 删除单条信息
 */
const destroyByPk = async (ctx, next) => {
  const auth = await model.Auth.findByPk(ctx.params.id);
  ctx.assert(auth, 404, "记录不存在");
  ctx.body = await auth.destroy();

  next();
};

/**
 * 查询单条信息
 */
const findOne = async (ctx, next) => {
  const auth = await model.Auth.findOne({ where: ctx.query });
  ctx.assert(auth, 404, "记录不存在");
  // const user = await model.User.findByPk(auth.userId);
  const user = await auth.getUser();
  ctx.assert(user, 500, "外键记录不存在");
  ctx.body = { ...auth.get({ plain: true }), user };

  next();
};

/**
 * 查询或创建单条信息
 */
const findOrCreate = async (ctx, next) => {
  const [auth, created] = await model.Auth.findOrCreate({
    where: ctx.request.body,
  });
  ctx.body = {
    // ...auth.toJSON(),
    ...auth.get({ plain: true }),
    created,
  };

  next();
};

export default {
  findAndCountAll,
  findByPk,
  singleCreate,
  bulkCreate,
  bulkUpdate,
  updateByPk,
  bulkDestroy,
  destroyByPk,
  findOne,
  findOrCreate,
};
