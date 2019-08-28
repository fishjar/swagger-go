import app from "./app";
import sequelize from "./db";
import model from "./model";
import config from "./config";
import sign from "./utils/sign";

const {
  NODE_PORT,
  DEFAULT_USERNAME,
  DEFAULT_USERTYPE,
  DEFAULT_PASSWORD
} = config;

sequelize
  .sync() // 带上{force: true}参数会强制删除已存在的表
  .then(() => {
    // 创建默认用户
    const password = sign.signPwd({
      userName: DEFAULT_USERNAME,
      password: DEFAULT_PASSWORD
    });
    return model.User.findOrCreate({
      where: {
        userName: DEFAULT_USERNAME,
        userType: DEFAULT_USERTYPE,
        password
      }
    });
  })
  .then(() => {
    // 启动服务
    app.listen(NODE_PORT);
    console.log(`\n>>> app run at port: ${NODE_PORT} <<<\n`);
  })
  .catch(err => {
    console.log(err);
  });
