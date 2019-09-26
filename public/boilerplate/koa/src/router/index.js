import Router from "koa-router";
import handler from "../handler";
import roleAuth from "../middleware/roleAuth";

const router = new Router();

router
  .get("/test/fetch", roleAuth(["guest"]), handler.Test.fetch)
  .post("/test/create", roleAuth(["user"]), handler.Test.createAuth)
  .get("/test/raw", roleAuth(["user"]), handler.Test.queryRaw)

  .get("/user/menus", roleAuth(["user"]), handler.User.findUserMenus)
  .get("/user/current", roleAuth(["user"]), handler.User.findCurrentUser)
  .get("/user", roleAuth(["admin"]), handler.User.findOne) // 根据条件查找单条
  .post("/user", roleAuth(["admin"]), handler.User.findOrCreate) // 查找或创建单条
  .get("/users", roleAuth(["admin"]), handler.User.findAndCountAll) // 获取多条
  .post("/users", roleAuth(["admin"]), handler.User.singleCreate) // 创建单条
  .patch("/users", roleAuth(["admin"]), handler.User.bulkUpdate) // 更新多条
  .delete("/users", roleAuth(["admin"]), handler.User.bulkDestroy) // 删除多条
  .get("/users/:id", roleAuth(["admin"]), handler.User.findByPk) // 根据主键查找单条
  .patch("/users/:id", roleAuth(["admin"]), handler.User.updateByPk) // 更新单条
  .delete("/users/:id", roleAuth(["admin"]), handler.User.destroyByPk) // 删除单条
  .post("/users/multiple", roleAuth(["admin"]), handler.User.bulkCreate) // 创建多条

  .get("/auth", roleAuth(["admin"]), handler.Auth.findOne) // 根据条件查找单条
  .post("/auth", roleAuth(["admin"]), handler.Auth.findOrCreate) // 查找或创建单条
  .get("/auths", roleAuth(["admin"]), handler.Auth.findAndCountAll) // 获取多条
  .post("/auths", roleAuth(["admin"]), handler.Auth.singleCreate) // 创建单条
  .patch("/auths", roleAuth(["admin"]), handler.Auth.bulkUpdate) // 更新多条
  .delete("/auths", roleAuth(["admin"]), handler.Auth.bulkDestroy) // 删除多条
  .get("/auths/:id", roleAuth(["admin"]), handler.Auth.findByPk) // 根据主键查找单条
  .patch("/auths/:id", roleAuth(["admin"]), handler.Auth.updateByPk) // 更新单条
  .delete("/auths/:id", roleAuth(["admin"]), handler.Auth.destroyByPk) // 删除单条
  .post("/auths/multiple", roleAuth(["admin"]), handler.Auth.bulkCreate) // 创建多条

  .get("/role", roleAuth(["admin"]), handler.Role.findOne) // 根据条件查找单条
  .post("/role", roleAuth(["admin"]), handler.Role.findOrCreate) // 查找或创建单条
  .get("/roles", roleAuth(["admin"]), handler.Role.findAndCountAll) // 获取多条
  .post("/roles", roleAuth(["admin"]), handler.Role.singleCreate) // 创建单条
  .patch("/roles", roleAuth(["admin"]), handler.Role.bulkUpdate) // 更新多条
  .delete("/roles", roleAuth(["admin"]), handler.Role.bulkDestroy) // 删除多条
  .get("/roles/:id", roleAuth(["admin"]), handler.Role.findByPk) // 根据主键查找单条
  .patch("/roles/:id", roleAuth(["admin"]), handler.Role.updateByPk) // 更新单条
  .delete("/roles/:id", roleAuth(["admin"]), handler.Role.destroyByPk) // 删除单条
  .post("/roles/multiple", roleAuth(["admin"]), handler.Role.bulkCreate) // 创建多条

  .get("/group", roleAuth(["guest"]), handler.Group.findOne) // 根据条件查找单条
  .post("/group", roleAuth(["guest"]), handler.Group.findOrCreate) // 查找或创建单条
  .get("/groups", roleAuth(["guest"]), handler.Group.findAndCountAll) // 获取多条
  .post("/groups", roleAuth(["guest"]), handler.Group.singleCreate) // 创建单条
  .patch("/groups", roleAuth(["guest"]), handler.Group.bulkUpdate) // 更新多条
  .delete("/groups", roleAuth(["guest"]), handler.Group.bulkDestroy) // 删除多条
  .get("/groups/:id", roleAuth(["guest"]), handler.Group.findByPk) // 根据主键查找单条
  .patch("/groups/:id", roleAuth(["guest"]), handler.Group.updateByPk) // 更新单条
  .delete("/groups/:id", roleAuth(["guest"]), handler.Group.destroyByPk) // 删除单条
  .post("/groups/multiple", roleAuth(["guest"]), handler.Group.bulkCreate) // 创建多条

  .get("/menu", roleAuth(["user"]), handler.Menu.findOne) // 根据条件查找单条
  .post("/menu", roleAuth(["user"]), handler.Menu.findOrCreate) // 查找或创建单条
  .get("/menus", roleAuth(["user"]), handler.Menu.findAndCountAll) // 获取多条
  .post("/menus", roleAuth(["user"]), handler.Menu.singleCreate) // 创建单条
  .patch("/menus", roleAuth(["user"]), handler.Menu.bulkUpdate) // 更新多条
  .delete("/menus", roleAuth(["user"]), handler.Menu.bulkDestroy) // 删除多条
  .get("/menus/:id", roleAuth(["user"]), handler.Menu.findByPk) // 根据主键查找单条
  .patch("/menus/:id", roleAuth(["user"]), handler.Menu.updateByPk) // 更新单条
  .delete("/menus/:id", roleAuth(["user"]), handler.Menu.destroyByPk) // 删除单条
  .post("/menus/multiple", roleAuth(["user"]), handler.Menu.bulkCreate) // 创建多条

  .get("/usergroup", roleAuth(["admin"]), handler.UserGroup.findOne) // 根据条件查找单条
  .post("/usergroup", roleAuth(["admin"]), handler.UserGroup.findOrCreate) // 查找或创建单条
  .get("/usergroups", roleAuth(["admin"]), handler.UserGroup.findAndCountAll) // 获取多条
  .post("/usergroups", roleAuth(["admin"]), handler.UserGroup.singleCreate) // 创建单条
  .patch("/usergroups", roleAuth(["admin"]), handler.UserGroup.bulkUpdate) // 更新多条
  .delete("/usergroups", roleAuth(["admin"]), handler.UserGroup.bulkDestroy) // 删除多条
  .get("/usergroups/:id", roleAuth(["admin"]), handler.UserGroup.findByPk) // 根据主键查找单条
  .patch("/usergroups/:id", roleAuth(["admin"]), handler.UserGroup.updateByPk) // 更新单条
  .delete("/usergroups/:id", roleAuth(["admin"]), handler.UserGroup.destroyByPk) // 删除单条
  .post("/usergroups/multiple", roleAuth(["admin"]), handler.UserGroup.bulkCreate) // 创建多条

  .post("/login/account", handler.Login.account) // 帐号密码登录
  .post("/login/phone", handler.Login.phone) // 手机登录
  .post("/login/wechat", handler.Login.wechat); // 微信登录

export default router;
