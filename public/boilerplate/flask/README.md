# flask rest boilerplate

## 使用指引

```sh
# 虚拟环境
# apt-get install python3-venv
python3 -m venv venv

# 激活
. venv/bin/activate

# 安装依赖
# pip install Flask
# pip install Flask-SQLAlchemy
# pip install flask-marshmallow
# pip install marshmallow-sqlalchemy
# pip install PyJWT
# pip install schema
# pip install pymysql
pip install -r requirements.txt

# 环境变量
export FLASK_APP=flaskr
# export FLASK_ENV=production # 缺省值
# export FLASK_ENV=testing
export FLASK_ENV=development

# 初始化
flask init-db

# 运行
flask run

# 打开一个 Shell
flask shell

# 导出依赖
pip freeze > requirements.txt
```

### 生产部署

```sh
# 依赖
pip install gunicorn
pip install gevent

# 如有需要
# 启动一个数据库
sudo docker-compose -f docker-compose.mysql.yml up -d

# 运行
# gunicorn main:app -w 4 -e FLASK_ENV=production -b :8000
gunicorn -c gunicorn.py main:app
```

### docker 部署

```sh
# 编辑环境变量
vi .env.prod

# 启动
docker-compose up -d

# 初始化数据
docker-compose exec web flask init-db

# 测试
curl 127.0.0.1:8000
curl -H "Content-Type: application/json" -d '{"userName":"gabe","password":"123456"}' 127.0.0.1:8000/login/account

# 进入容器
docker-compose exec web bash
docker-compose exec db bash
```

## 存在问题

- （已解决，存小小问题）`Relationships` 问题： [参考](https://docs.sqlalchemy.org/en/13/orm/basic_relationships.html)
  - 模型相互引用问题，网上很多类似问题：[参考](https://stackoverflow.com/questions/34421205/sqlalchemy-model-circular-import/34503823),[2](https://stackoverflow.com/questions/58095513/flask-sqlalchemy-relationship-error-name-classname-is-not-defined-using-diff)
  - `Menu` 自引用问题，`remote_side=[id]` 的 `id`在`BaseModel`定义，如何引入
  - `User`、`Group`、`UserGroup` 相互引用问题
- 部分错误无法被`_handle_exception`捕获，而是被内置处理器捕获了
- （已解决）暂无优雅的数据校验，`sqlalchemy` 推荐的校验方式很繁琐

## 目录结构

```sh
├── docker-compose.mysql.yml
├── docker-compose.yml
├── Dockerfile
├── flaskr
│   ├── config.py
│   ├── handler
│   │   ├── Auth.py
│   │   ├── Group.py
│   │   ├── __init__.py
│   │   ├── Login.py
│   │   ├── Menu.py
│   │   ├── Role.py
│   │   ├── UserGroup.py
│   │   └── User.py
│   ├── __init__.py
│   ├── model
│   │   ├── Auth.py
│   │   ├── Base.py
│   │   ├── Group.py
│   │   ├── __init__.py
│   │   ├── Menu.py
│   │   ├── Role.py
│   │   ├── UserGroup.py
│   │   └── User.py
│   ├── router
│   │   └── __init__.py
│   └── utils
│       ├── auth.py
│       ├── bp.py
│       ├── cmd.py
│       ├── err.py
│       ├── __init__.py
│       ├── jwt.py
│       ├── log.py
│       └── __pycache__
├── gunicorn.py
├── LICENSE
├── main.py
├── README.md
└── requirements.txt
```
