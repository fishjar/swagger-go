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
  const { count, rows } = await model.UserGroup.findAndCountAll({
    where,
    offset: (pageNum - 1) * pageSize,
    limit: pageSize > 0 ? pageSize : null,
    order,
    include: [
      {
        model: model.User,
        as: "user",
      },
      {
        model: model.Group,
        as: "group",
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
  const group = await model.UserGroup.findByPk(ctx.params.id);
  ctx.assert(group, 404, "记录不存在");
  ctx.body = group;

  await next();
};

/**
 * 创建单条信息
 */
const singleCreate = async (ctx, next) => {
  ctx.body = await model.UserGroup.create(ctx.request.body);

  await next();
};

/**
 * 创建多条信息
 */
const bulkCreate = async (ctx, next) => {
  ctx.body = await model.UserGroup.bulkCreate(ctx.request.body, {
    validate: true,
  });

  await next();
};

/**
 * 更新多条信息
 */
const bulkUpdate = async (ctx, next) => {
  const { id } = ctx.query;
  ctx.assert(id, 400, "参数有误");
  ctx.body = await model.UserGroup.update(ctx.request.body, { where: { id } });

  await next();
};

/**
 * 更新单条信息
 */
const updateByPk = async (ctx, next) => {
  const group = await model.UserGroup.findByPk(ctx.params.id);
  ctx.assert(group, 404, "记录不存在");
  ctx.body = await group.update(ctx.request.body);

  await next();
};

/**
 * 删除多条信息
 */
const bulkDestroy = async (ctx, next) => {
  const { id } = ctx.query;
  ctx.assert(id, 400, "参数有误");
  ctx.body = await model.UserGroup.destroy({ where: { id } });

  await next();
};

/**
 * 删除单条信息
 */
const destroyByPk = async (ctx, next) => {
  const group = await model.UserGroup.findByPk(ctx.params.id);
  ctx.assert(group, 404, "记录不存在");
  ctx.body = await group.destroy();

  await next();
};

/**
 * 查询单条信息
 */
const findOne = async (ctx, next) => {
  const group = await model.UserGroup.findOne({ where: ctx.query });
  ctx.assert(group, 404, "记录不存在");
  ctx.body = group;

  await next();
};

/**
 * 查询或创建单条信息
 */
const findOrCreate = async (ctx, next) => {
  const [group, created] = await model.UserGroup.findOrCreate({
    where: ctx.request.body,
  });
  ctx.body = {
    // ...group.toJSON(),
    ...group.get({ plain: true }),
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
