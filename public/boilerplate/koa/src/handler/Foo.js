import model from "../model";

/**
 * 查询多条信息
 */
const findAndCountAll = async (ctx, next) => {
  const { page_num = 1, page_size = 10, sorter, ...where } = ctx.query;
  let order = [];
  if (Array.isArray(sorter)) {
    order = [...sorter.map(item => item.split("__"))];
  } else if (sorter) {
    order = [sorter.split("__")];
  }
  ctx.body = await model.Foo.findAndCountAll({
    where,
    offset: (page_num - 1) * page_size,
    limit: page_size,
    order,
  });
  await next();
};

/**
 * 根据ID查询单条信息
 */
const findById = async (ctx, next) => {
  ctx.body = await model.Foo.findById(ctx.params.id);
  await next();
};

/**
 * 创建单条信息
 */
const singleCreate = async (ctx, next) => {
  ctx.body = await model.Foo.create(ctx.request.body);
  await next();
};

/**
 * 创建多条信息
 */
const bulkCreate = async (ctx, next) => {
  ctx.body = await model.Foo.bulkCreate(ctx.request.body);
  await next();
};

/**
 * 更新多条信息
 */
const bulkUpdate = async (ctx, next) => {
  ctx.body = await model.Foo.update(ctx.request.body.fields, {
    where: ctx.request.body.filter,
  });
  await next();
};

/**
 * 更新单条信息
 */
const updateById = async (ctx, next) => {
  const obj = await model.Foo.findById(ctx.params.id);
  ctx.body = await obj.update(ctx.request.body);
  await next();
};

/**
 * 删除多条信息
 */
const bulkDestroy = async (ctx, next) => {
  ctx.body = await model.Foo.destroy({
    where: ctx.request.body,
  });
  await next();
};

/**
 * 删除单条信息
 */
const destroyById = async (ctx, next) => {
  const obj = await model.Foo.findById(ctx.params.id);
  ctx.body = await obj.destroy();
  await next();
};

/**
 * 查询单条信息
 */
const findOne = async (ctx, next) => {
  ctx.body = await model.Foo.findOne({ where: ctx.query });
  await next();
};

/**
 * 查询或创建单条信息
 */
const findOrCreate = async (ctx, next) => {
  const [data, is_new_record] = await model.Foo.findOrCreate({
    where: ctx.request.body,
  });
  ctx.body = {
    // ...data.toJSON(),
    ...data.get({ plain: true }),
    is_new_record,
  };
  await next();
};

export default {
  findAndCountAll,
  findById,
  singleCreate,
  bulkCreate,
  bulkUpdate,
  updateById,
  bulkDestroy,
  destroyById,
  findOne,
  findOrCreate,
};
