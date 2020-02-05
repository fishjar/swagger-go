import os

# 获取当前路径(项目根目录)
base_dir = os.path.abspath(os.path.dirname(__file__))
DATABASE_URI = os.environ.get("DATABASE_URI","sqlite:///:memory:")

class Config(object):
    """共用的基本配置"""
    DEBUG = False
    TESTING = False
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev")
    JWT_SECRET = os.environ.get("JWT_SECRET", "123456")
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    SQLALCHEMY_TRACK_MODIFICATIONS = False  # 追踪对象的修改并且发送信号
    # SQLALCHEMY_POOL_SIZE = 5  # 数据库连接池的大小
    # SQLALCHEMY_POOL_TIMEOUT = 10  # 数据库连接池的超时时间
    # SQLALCHEMY_POOL_RECYCLE = 60*60*2  # 自动回收连接的秒数


class ProductionConfig(Config):
    """生产环境配置"""
    # SQLALCHEMY_DATABASE_URI = "mysql+pymysql://root:123456@127.0.0.1:3306/testdb"
    # SQLALCHEMY_DATABASE_URI = "mysql+pymysql://root:123456@db:3306/testdb"
    SQLALCHEMY_DATABASE_URI = DATABASE_URI
    SQLALCHEMY_ECHO = True  # 打印SQL语句


class DevelopmentConfig(Config):
    """开发环境配置"""
    DEBUG = True
    SQLALCHEMY_ECHO = True  # 打印SQL语句

    @property
    def SQLALCHEMY_DATABASE_URI(self):
        """创建数据库文件夹"""
        tmp_dir = os.path.join(base_dir, "tmp")
        os.makedirs(tmp_dir, exist_ok=True)  # 确保文件夹存在
        return "sqlite:///" + os.path.join(tmp_dir, "dev.sqlite")


class TestingConfig(Config):
    """测试环境配置"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
