# KOA REST boilerplate

## 支持特性

- 基于web框架[KOA](https://github.com/koajs/koa)，以及ORM框架[sequelize](https://github.com/sequelize/sequelize)，开箱即用
- 简易登录及`JWT`验证、续签
- 支持开发热重启，支持ES6语法，支持babel转码及编译压缩

## 缺陷（待改进）

- 可能存在SQL注入风险
- 缺少文件上传、下载功能
- 缺少单元测试

## 目录结构

```sh
├── dist                      #输出目录
├── docker-compose.yml
├── Dockerfile
├── package.json
├── package-lock.json
├── README.md
├── src                       #源码目录
│   ├── app.js                #koa配置
│   ├── config                #配置目录
│   │   ├── config.development.js
│   │   ├── config.production.js
│   │   ├── config.test.js
│   │   └── index.js
│   ├── db                    #数据库配置及文件目录
│   │   └── index.js
│   ├── handler               #路由handler目录
│   │   ├── account.js
│   │   ├── foo.js
│   │   └── index.js
│   ├── log                   #日志目录
│   ├── middleware            #中间件目录
│   │   ├── errorHandler.js   #全局错误捕获
│   │   ├── jwtAuth.js        #jwt认证
│   │   ├── jwtRolling.js     #jwt刷新
│   │   ├── koaBody.js        #请求body处理
│   │   └── reqBodyLog.js     #请求日志
│   ├── model                 #模型目录
│   │   ├── foo.js
│   │   ├── index.js
│   │   └── user.js
│   ├── router                #路由配置
│   │   └── index.js
│   ├── server.js             #启动文件
│   └── utils                 #工具包
│       ├── api.js            #api封装
│       ├── index.js          #工具函数
│       ├── jwt.js            #jwt封装
│       ├── logger.js         #日志函数配置
│       ├── request.js        #请求函数封装
│       └── sign.js           #加密封装
└── yarn.lock
```

## 依赖列表

```js
"dependencies": {
  "@koa/cors": "^2.2.2", // 跨域请求配置及处理
  "cross-env": "^5.2.0", // 跨系统的环境设置
  "jsonwebtoken": "^8.4.0", // JWT 认证插件
  "koa": "^2.6.1", // 核心包
  "koa-body": "^4.2.1", // body解析
  "koa-compress": "^3.0.0", // gzip压缩
  "koa-jwt": "^3.5.1", // JWT 验证
  "koa-logger": "^3.2.0", // 日志中间件
  "koa-qs": "^2.0.0", // querystring处理
  "koa-router": "^7.4.0", // 路由插件
  "mysql2": "^1.6.4", // mysql支持
  "request": "^2.88.0", // http请求插件
  "request-promise": "^4.2.2",
  "sequelize": "^4.41.1", // ORM插件
  "strip-ansi": "^5.0.0", // 输出纯净日志文本
  "winston": "^3.1.0", // 日志框架
  "winston-daily-rotate-file": "^3.5.1" // 日志按日期分割
},
"devDependencies": {
  "babel-cli": "^6.26.0", // ES6支持
  "babel-plugin-transform-object-rest-spread": "^6.26.0",
  "babel-plugin-transform-runtime": "^6.23.0",
  "babel-preset-env": "^1.7.0",
  "babel-preset-minify": "^0.5.0", // 压缩
  "nodemon": "^1.18.6", // 热重启
  "rimraf": "^2.6.2", // 清空文件夹
  "sqlite3": "^4.0.3" // sqlite支持
},
```

## 使用指引

```sh
# 创建并进入目录
mkdir koa-rest-boilerplate && cd "$_"

# 克隆项目
git clone https://github.com/fishjar/koa-rest-boilerplate.git .

# 安装依赖
yarn

# 开发
yarn dev

# 编译（清空dist文件夹+转码+压缩）
yarn build

# 启动编译后代码
yarn start

# 开发时，如有需要，运行下列命令启动一个mysql数据库服务
sudo docker-compose -f ./src/db/docker-compose.mysql.yml up -d

# 简易部署
sudo docker-compose up -d
```

## 模型验证参数参考

```js
const ValidateMe = sequelize.define("foo", {
  foo: {
    type: Sequelize.STRING,
    validate: {
      is: ["^[a-z]+$", "i"], // 只允许字母
      is: /^[a-z]+$/i, // 与上一个示例相同,使用了真正的正则表达式
      not: ["[a-z]", "i"], // 不允许字母
      isEmail: true, // 检查邮件格式 (foo@bar.com)
      isUrl: true, // 检查连接格式 (http://foo.com)
      isIP: true, // 检查 IPv4 (129.89.23.1) 或 IPv6 格式
      isIPv4: true, // 检查 IPv4 (129.89.23.1) 格式
      isIPv6: true, // 检查 IPv6 格式
      isAlpha: true, // 只允许字母
      isAlphanumeric: true, // 只允许使用字母数字
      isNumeric: true, // 只允许数字
      isInt: true, // 检查是否为有效整数
      isFloat: true, // 检查是否为有效浮点数
      isDecimal: true, // 检查是否为任意数字
      isLowercase: true, // 检查是否为小写
      isUppercase: true, // 检查是否为大写
      notNull: true, // 不允许为空
      isNull: true, // 只允许为空
      notEmpty: true, // 不允许空字符串
      equals: "specific value", // 只允许一个特定值
      contains: "foo", // 检查是否包含特定的子字符串
      notIn: [["foo", "bar"]], // 检查是否值不是其中之一
      isIn: [["foo", "bar"]], // 检查是否值是其中之一
      notContains: "bar", // 不允许包含特定的子字符串
      len: [2, 10], // 只允许长度在2到10之间的值
      isUUID: 4, // 只允许uuids
      isDate: true, // 只允许日期字符串
      isAfter: "2011-11-05", // 只允许在特定日期之后的日期字符串
      isBefore: "2011-11-05", // 只允许在特定日期之前的日期字符串
      max: 23, // 只允许值 <= 23
      min: 23, // 只允许值 >= 23
      isCreditCard: true, // 检查有效的信用卡号码

      // 也可以自定义验证:
      isEven(value) {
        if (parseInt(value) % 2 != 0) {
          throw new Error("Only even values are allowed!");
          // 我们也在模型的上下文中，所以如果它存在的话,
          // this.otherField会得到otherField的值。
        }
      }
    }
  }
});
```
