import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flaskr.config import ProductionConfig, DevelopmentConfig, TestingConfig
from flaskr.utils import cmd, bp, err, log, auth

__version__ = (1, 0, 0, "dev")

db = SQLAlchemy()
ma = Marshmallow()


def create_app(config=None):
    """创建APP实例"""
    app = Flask(__name__, instance_relative_config=True)

    # 加载配置信息
    if config is None:
        FLASK_ENV = os.environ.get("FLASK_ENV")
        if FLASK_ENV == 'development':
            app.config.from_object(DevelopmentConfig())
        elif FLASK_ENV == 'testing':
            app.config.from_object(TestingConfig())
        else:
            app.config.from_object(ProductionConfig())
    else:
        app.config.update(config)

    # 初始化
    log.init_app(app)  # 日志记录
    db.init_app(app)  # 数据库（ORM）
    ma.init_app(app)  # 序列化
    cmd.init_app(app)  # 添加命令+插入数据
    bp.init_app(app)  # 注册蓝图（路由）
    with app.app_context():
        # 块中可以访问 current_app
        err.init_app()  # 错误捕获

    auth.init_app(app)  # 注入认证中间件

    return app
