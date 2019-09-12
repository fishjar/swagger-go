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
  const { count, rows } = await model.Role.findAndCountAll({
    where,
    offset: (pageNum - 1) * pageSize,
    limit: pageSize,
    order,
    include: [
      {
        model: model.Role,
        as: "parent",
      },
      {
        model: model.Role,
        as: "child",
      },
      {
        model: model.User,
        as: "users",
      },
    ],
    distinct: true,
  });
  ctx.body = { count, rows };

  await next();
};

/**
 * 根据主键查询单条信息
 */
const findByPk = async (ctx, next) => {
  const role = await model.Role.findByPk(ctx.params.id);
  ctx.assert(role, 404, "记录不存在");
  const parent = await role.getParent();
  const child = await role.getChild();

  ctx.body = { ...role.get({ plain: true }), parent, child };

  await next();
};

/**
 * 创建单条信息
 */
const singleCreate = async (ctx, next) => {
  ctx.body = await model.Role.create(ctx.request.body);

  await next();
};

/**
 * 创建多条信息
 */
const bulkCreate = async (ctx, next) => {
  ctx.body = await model.Role.bulkCreate(ctx.request.body, {
    validate: true,
  });

  await next();
};

/**
 * 更新多条信息
 */
const bulkUpdate = async (ctx, next) => {
  ctx.body = await model.Role.update(ctx.request.body.fields, {
    where: ctx.request.body.filter,
  });

  await next();
};

/**
 * 更新单条信息
 */
const updateByPk = async (ctx, next) => {
  const role = await model.Role.findByPk(ctx.params.id);
  ctx.assert(role, 404, "记录不存在");
  ctx.body = await role.update(ctx.request.body);

  await next();
};

/**
 * 删除多条信息
 */
const bulkDestroy = async (ctx, next) => {
  ctx.body = await model.Role.destroy({
    where: ctx.request.body,
  });

  await next();
};

/**
 * 删除单条信息
 */
const destroyByPk = async (ctx, next) => {
  const role = await model.Role.findByPk(ctx.params.id);
  ctx.assert(role, 404, "记录不存在");
  ctx.body = await role.destroy();

  await next();
};

/**
 * 查询单条信息
 */
const findOne = async (ctx, next) => {
  const role = await model.Role.findOne({ where: ctx.query });
  ctx.assert(role, 404, "记录不存在");
  const parent = await role.getParent();
  const child = await role.getChild();

  ctx.body = { ...role.get({ plain: true }), parent, child };

  await next();
};

/**
 * 查询或创建单条信息
 */
const findOrCreate = async (ctx, next) => {
  const [role, created] = await model.Role.findOrCreate({
    where: ctx.request.body,
  });
  ctx.body = {
    // ...role.toJSON(),
    ...role.get({ plain: true }),
    created,
  };

  await next();
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
