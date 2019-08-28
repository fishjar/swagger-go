import Router from "koa-router";

import handler from "../handler";

const router = new Router();
router
  .post("/account/login", handler.Account.login)

  .get("/foo", handler.Foo.findOne)                 // 根据条件查找单条
  .post("/foo", handler.Foo.findOrCreate)           // 查找或创建单条

  .get("/foos", handler.Foo.findAndCountAll)        // 获取多条
  .post("/foos", handler.Foo.singleCreate)          // 创建单条
  .patch("/foos", handler.Foo.bulkUpdate)           // 更新多条
  .delete("/foos", handler.Foo.bulkDestroy)         // 删除多条

  .get("/foos/:id", handler.Foo.findById)           // 根据ID查找单条
  .patch("/foos/:id", handler.Foo.updateById)       // 更新单条
  .delete("/foos/:id", handler.Foo.destroyById)     // 删除单条
  
  .post("/foos/multiple", handler.Foo.bulkCreate);  // 创建多条

export default router;
