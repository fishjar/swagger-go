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
  const { count, rows } = await model.Menu.findAndCountAll({
    where,
    offset: (pageNum - 1) * pageSize,
    limit: pageSize,
    order,
    include: [
      {
        model: model.Role,
        as: "roles",
      },
      {
        model: model.Menu,
        as: "parent",
      },
      {
        model: model.Menu,
        as: "children",
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
  const menu = await model.Menu.findByPk(ctx.params.id);
  ctx.assert(menu, 404, "记录不存在");
  const parent = await role.getParent();
  const children = await role.getChildren();

  ctx.body = { ...menu.get({ plain: true }), parent, children };

  await next();
};

/**
 * 创建单条信息
 */
const singleCreate = async (ctx, next) => {
  ctx.body = await model.Menu.create(ctx.request.body);

  await next();
};

/**
 * 创建多条信息
 */
const bulkCreate = async (ctx, next) => {
  ctx.body = await model.Menu.bulkCreate(ctx.request.body, {
    validate: true,
  });

  await next();
};

/**
 * 更新多条信息
 */
const bulkUpdate = async (ctx, next) => {
  ctx.body = await model.Menu.update(ctx.request.body.fields, {
    where: ctx.request.body.filter,
  });

  await next();
};

/**
 * 更新单条信息
 */
const updateByPk = async (ctx, next) => {
  const menu = await model.Menu.findByPk(ctx.params.id);
  ctx.assert(menu, 404, "记录不存在");
  ctx.body = await menu.update(ctx.request.body);

  await next();
};

/**
 * 删除多条信息
 */
const bulkDestroy = async (ctx, next) => {
  ctx.body = await model.Menu.destroy({
    where: ctx.request.body,
  });

  await next();
};

/**
 * 删除单条信息
 */
const destroyByPk = async (ctx, next) => {
  const menu = await model.Menu.findByPk(ctx.params.id);
  ctx.assert(menu, 404, "记录不存在");
  ctx.body = await menu.destroy();

  await next();
};

/**
 * 查询单条信息
 */
const findOne = async (ctx, next) => {
  const menu = await model.Menu.findOne({ where: ctx.query });
  ctx.assert(menu, 404, "记录不存在");
  ctx.body = menu;

  await next();
};

/**
 * 查询或创建单条信息
 */
const findOrCreate = async (ctx, next) => {
  const [menu, created] = await model.Menu.findOrCreate({
    where: ctx.request.body,
  });
  ctx.body = {
    // ...menu.toJSON(),
    ...menu.get({ plain: true }),
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
