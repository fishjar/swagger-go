import model from "../model";
import { formatMenus } from "../utils";

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
  const { count, rows } = await model.User.findAndCountAll({
    where,
    offset: (pageNum - 1) * pageSize,
    limit: pageSize,
    order,
    include: [
      {
        model: model.Auth,
        as: "auths",
        // include: [
        //   {
        //     model: model.User,
        //   },
        // ],
      },
      {
        model: model.Role,
        as: "roles",
        include: [
          {
            model: model.Menu,
            as: "menus",
          },
        ],
      },
      {
        model: model.User,
        as: "friends",
      },
      {
        model: model.Group,
        as: "groups",
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
  const user = await model.User.findByPk(ctx.params.id);
  ctx.assert(user, 404, "记录不存在");
  const auths = await user.getAuths();
  const roles = await user.getRoles();
  ctx.body = { ...user.get({ plain: true }), auths, roles };
  await next();
};

/**
 * 创建单条信息
 */
const singleCreate = async (ctx, next) => {
  ctx.body = await model.User.create(ctx.request.body);

  await next();
};

/**
 * 创建多条信息
 */
const bulkCreate = async (ctx, next) => {
  ctx.body = await model.User.bulkCreate(ctx.request.body, {
    validate: true,
  });

  await next();
};

/**
 * 更新多条信息
 */
const bulkUpdate = async (ctx, next) => {
  ctx.body = await model.User.update(ctx.request.body.fields, {
    where: ctx.request.body.filter,
  });

  await next();
};

/**
 * 更新单条信息
 */
const updateByPk = async (ctx, next) => {
  const user = await model.User.findByPk(ctx.params.id);
  ctx.assert(user, 404, "记录不存在");
  ctx.body = await user.update(ctx.request.body);

  await next();
};

/**
 * 删除多条信息
 */
const bulkDestroy = async (ctx, next) => {
  ctx.body = await model.User.destroy({
    where: ctx.request.body,
  });

  await next();
};

/**
 * 删除单条信息
 */
const destroyByPk = async (ctx, next) => {
  const user = await model.User.findByPk(ctx.params.id);
  ctx.assert(user, 404, "记录不存在");
  ctx.body = await user.destroy();

  await next();
};

/**
 * 查询单条信息
 */
const findOne = async (ctx, next) => {
  const user = await model.User.findOne({
    where: ctx.query,
    include: [
      {
        model: model.Role,
        as: "roles",
        include: [
          {
            model: model.Menu,
            as: "menus",
          },
        ],
      },
    ],
  });
  ctx.assert(user, 404, "记录不存在");
  ctx.body = user;

  await next();
};

/**
 * 查询或创建单条信息
 */
const findOrCreate = async (ctx, next) => {
  const [user, created] = await model.User.findOrCreate({
    where: ctx.request.body,
  });
  ctx.body = {
    // ...user.toJSON(),
    ...user.get({ plain: true }),
    created,
  };

  await next();
};

const findUserMenus = async (ctx, next) => {
  const { userId } = ctx.state.user;
  ctx.assert(userId, 401, "请先登录");
  const user = await model.User.findByPk(userId);
  ctx.assert(user, 404, "用户不存在");
  const roles = await user.getRoles({
    include: [
      {
        model: model.Menu,
        as: "menus",
        // include: [
        //   {
        //     model: model.Role,
        //     as: "roles",
        //   },
        // ],
      },
    ],
  });
  const menusMap = {};
  roles.forEach(role => {
    role.menus.forEach(menu => {
      menusMap[menu.id] = menu;
    });
  });
  const menus = Object.entries(menusMap).map(([_, item]) => item);
  const { format } = ctx.query;
  if (format) {
    ctx.body = formatMenus(menus, null);
  } else {
    ctx.body = menus;
  }

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
  findUserMenus,
};
