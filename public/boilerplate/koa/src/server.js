import app from "./app";
import sequelize from "./db";
import config from "./config";
import initData from "./utils/initData";

const { NODE_ENV, NODE_PORT } = config;

(async () => {
  try {
    // 测试数据库连接
    await sequelize.authenticate();
    console.log("\n连接数据库成功\n");

    if (NODE_ENV === "development") {
      // 同步数据库
      // 带上{force: true}参数会强制删除已存在的表
      await sequelize.sync();
      // await sequelize.sync({ force: true });
      // console.log("\n同步数据库表成功\n");

      // 插入初始数据
      await initData();
    }

    // 启动服务
    app.listen(NODE_PORT);
    console.log(`\n>>> app run at port: ${NODE_PORT} <<<\n`);
  } catch (err) {
    console.log(err);
    console.log("\n程序启动出错\n");
  }
})();
