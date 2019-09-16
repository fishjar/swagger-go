import Router from "koa-router";
import handler from "../handler";
import roleAuth from "../middleware/roleAuth";

const router = new Router();

router
  .get("/test/fetch", handler.Test.fetch)
  .post("/test/create", handler.Test.createAuth)
  .get("/test/raw", handler.Test.queryRaw)

  .get("/user/menus", roleAuth(["user"]), handler.User.findUserMenus) // 根据条件查找单条
  .get("/user", roleAuth(["user"]), handler.User.findOne) // 根据条件查找单条
  .post("/user", roleAuth(["user"]), handler.User.findOrCreate) // 查找或创建单条
  .get("/users", roleAuth(["user"]), handler.User.findAndCountAll) // 获取多条
  .post("/users", roleAuth(["user"]), handler.User.singleCreate) // 创建单条
  .patch("/users", roleAuth(["user"]), handler.User.bulkUpdate) // 更新多条
  .delete("/users", roleAuth(["user"]), handler.User.bulkDestroy) // 删除多条
  .get("/users/:id", roleAuth(["user"]), handler.User.findByPk) // 根据主键查找单条
  .patch("/users/:id", roleAuth(["user"]), handler.User.updateByPk) // 更新单条
  .delete("/users/:id", roleAuth(["user"]), handler.User.destroyByPk) // 删除单条
  .post("/users/multiple", roleAuth(["user"]), handler.User.bulkCreate) // 创建多条

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

  .get("/role/menus/:id", roleAuth(["user"]), handler.Role.findRoleMenus) // 根据条件查找单条
  .get("/role", roleAuth(["user"]), handler.Role.findOne) // 根据条件查找单条
  .post("/role", roleAuth(["user"]), handler.Role.findOrCreate) // 查找或创建单条
  .get("/roles", roleAuth(["user"]), handler.Role.findAndCountAll) // 获取多条
  .post("/roles", roleAuth(["user"]), handler.Role.singleCreate) // 创建单条
  .patch("/roles", roleAuth(["user"]), handler.Role.bulkUpdate) // 更新多条
  .delete("/roles", roleAuth(["user"]), handler.Role.bulkDestroy) // 删除多条
  .get("/roles/:id", roleAuth(["user"]), handler.Role.findByPk) // 根据主键查找单条
  .patch("/roles/:id", roleAuth(["user"]), handler.Role.updateByPk) // 更新单条
  .delete("/roles/:id", roleAuth(["user"]), handler.Role.destroyByPk) // 删除单条
  .post("/roles/multiple", roleAuth(["user"]), handler.Role.bulkCreate) // 创建多条

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

  .get("/menu", roleAuth(["admin"]), handler.Menu.findOne) // 根据条件查找单条
  .post("/menu", roleAuth(["admin"]), handler.Menu.findOrCreate) // 查找或创建单条
  .get("/menus", roleAuth(["admin"]), handler.Menu.findAndCountAll) // 获取多条
  .post("/menus", roleAuth(["admin"]), handler.Menu.singleCreate) // 创建单条
  .patch("/menus", roleAuth(["admin"]), handler.Menu.bulkUpdate) // 更新多条
  .delete("/menus", roleAuth(["admin"]), handler.Menu.bulkDestroy) // 删除多条
  .get("/menus/:id", roleAuth(["admin"]), handler.Menu.findByPk) // 根据主键查找单条
  .patch("/menus/:id", roleAuth(["admin"]), handler.Menu.updateByPk) // 更新单条
  .delete("/menus/:id", roleAuth(["admin"]), handler.Menu.destroyByPk) // 删除单条
  .post("/menus/multiple", roleAuth(["admin"]), handler.Menu.bulkCreate) // 创建多条

  .post("/login/account", handler.Login.account) // 帐号密码登录
  .post("/login/phone", handler.Login.phone) // 手机登录
  .post("/login/wechat", handler.Login.wechat); // 微信登录

export default router;
