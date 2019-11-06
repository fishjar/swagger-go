# GIN+GROM 的 REST 项目模板

## 支持特性

- [GIN](https://github.com/gin-gonic/gin)+[GROM](https://github.com/jinzhu/gorm) 开箱即用
- 简易登录及`JWT`验证、续签
- 模型中[`validator.v8`](https://godoc.org/gopkg.in/go-playground/validator.v8)数据校验

## 缺陷（待改进）

- 配置文件未区分开发、测试、生产环境
- 日志工具未使用协程，且未按级别及日期分开多文件
- 中间件获取`body`数据流后，又写入`body`中，可能对性能有影响
- 实例中缺少批量增、删、改的功能
- 缺少文件上传、下载功能

## 目录结构

```sh
├── config
│   └── config.go       #配置文件
├── db
│   └── db.go           #数据库实例
├── handler
│   ├── foo.go          #示例handler
│   └── login.go        #登录handler
├── log                 #日志目录
│   └── gin.log
├── main.go             #主程
├── middleware          #中间件包
│   ├── bodyLogger.go   #日志中间件
│   └── jwtAuth.go      #JWT验证中间件
├── model
│   ├── base.go         #共用model
│   ├── foo.go          #示例model
│   └── user.go         #用户model
├── README.md
├── router              #路由配置
│   └── router.go
└── utils               #工具包
    ├── jwt.go
    ├── logger.go
    └── md5.go
```

## 使用指引

```sh
# 确保已安装go，及$GOPATH环境变量已配置
go version
echo $GOPATH

# 创建并进入目录
mkdir -p $GOPATH/src/github.com/fishjar/gin-rest-boilerplate && cd "$_"

# 克隆项目
git clone https://github.com/fishjar/gin-rest-boilerplate.git .

# 确认配置文件(尤其数据库相关配置)
vi config/config.go
vi db/db.go

# 如有需要，运行下列命令启动一个mysql数据库服务
# 否则跳过此行
sudo docker-compose -f db/docker-compose.mysql.yml up -d

# 安装依赖
go get

# 启动
go run main.go

# 测试：登录
curl -X POST http://localhost:8000/account/login \
-H "Content-Type: application/json" \
-d '{"userName":"gabe","userType":"admin","password":"123456"}'

# 测试：创建记录，注意替换<token>为实际值
curl -X POST http://localhost:8000/foos \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <token>" \
-d '{"name":"gabe","good_time":"2019-06-06T00:00:00Z","status":1}'

# 测试：查询记录，注意替换<token>为实际值
curl http://localhost:8000/foos \
-H "Authorization: Bearer <token>"
```
