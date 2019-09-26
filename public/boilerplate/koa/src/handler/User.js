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
    limit: pageSize > 0 ? pageSize : null,
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
        // include: [
        //   {
        //     model: model.Menu,
        //     as: "menus",
        //   },
        // ],
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
  const user = await model.User.findByPk(ctx.params.id, {
    include: [
      {
        model: model.Role,
        as: "roles",
      },
      {
        model: model.Group,
        as: "groups",
      },
      {
        model: model.User,
        as: "friends",
      },
    ],
  });
  ctx.assert(user, 404, "记录不存在");
  ctx.body = user;

  await next();
};

/**
 * 创建单条信息
 */
const singleCreate = async (ctx, next) => {
  const { roles, groups, friends, ...fields } = ctx.request.body;

  // 创建用户
  const user = await model.User.create(fields);
  // 设置角色
  if (roles) {
    await user.setRoles(
      await Promise.all(roles.map(item => model.Role.findByPk(item.id)))
    );
  }
  // 设置组
  if (groups) {
    await user.setGroups(
      await Promise.all(groups.map(item => model.Group.findByPk(item.id)))
    );
  }
  // 设置朋友
  if (friends) {
    await user.setFriends(
      await Promise.all(friends.map(item => model.User.findByPk(item.id)))
    );
  }

  ctx.body = user;

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
  const { id } = ctx.query;
  ctx.assert(id, 400, "参数有误");
  ctx.body = await model.User.update(ctx.request.body, { where: { id } });

  await next();
};

/**
 * 更新单条信息
 */
const updateByPk = async (ctx, next) => {
  const user = await model.User.findByPk(ctx.params.id);
  ctx.assert(user, 404, "记录不存在");
  const { roles, groups, friends, ...fields } = ctx.request.body;

  // 设置角色
  if (roles) {
    await user.setRoles(
      await Promise.all(roles.map(item => model.Role.findByPk(item.id)))
    );
  }
  // 设置组
  if (groups) {
    await user.setGroups(
      await Promise.all(groups.map(item => model.Group.findByPk(item.id)))
    );
  }
  // 设置朋友
  if (friends) {
    await user.setFriends(
      await Promise.all(friends.map(item => model.User.findByPk(item.id)))
    );
  }

  ctx.body = await user.update(fields);

  await next();
};

/**
 * 删除多条信息
 */
const bulkDestroy = async (ctx, next) => {
  const { id } = ctx.query;
  ctx.assert(id, 400, "参数有误");
  ctx.body = await model.User.destroy({ where: { id } });

  await next();
};

/**
 * 删除单条信息
 */
const destroyByPk = async (ctx, next) => {
  const user = await model.User.findByPk(ctx.params.id);
  ctx.assert(user, 404, "记录不存在");

  // 删除关联数据
  await user.setRoles([]);
  await user.setGroups([]);
  await user.setFriends([]);

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

/**
 * 获取当前用户菜单
 * @param {*} ctx 
 * @param {*} next 
 */
const findUserMenus = async (ctx, next) => {
  const { authId } = ctx.state.user;
  const auth = await model.Auth.findByPk(authId, {
    include: [
      {
        model: model.User,
        as: "user",
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
      },
    ],
  });

  const menusMap = {};
  auth.user.roles.forEach(role => {
    role.menus.forEach(menu => {
      menusMap[menu.id] = menu;
    });
  });

  ctx.body = Object.entries(menusMap).map(([_, item]) => item);

  await next();
};


/**
 * 获取当前用户信息
 * @param {*} ctx 
 * @param {*} next 
 */
const findCurrentUser = async (ctx, next) => {
  const { authId } = ctx.state.user;
  const auth = await model.Auth.findByPk(authId, {
    include: [
      {
        model: model.User,
        as: "user",
      },
    ],
  });
  ctx.body = auth.user;

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
  findCurrentUser,
};
