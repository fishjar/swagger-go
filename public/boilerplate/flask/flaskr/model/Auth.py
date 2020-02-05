import enum

from flaskr import db, ma
from .Base import BaseModel, Column
# from werkzeug.exceptions import abort
# from werkzeug.security import generate_password_hash, check_password_hash


class Auth(BaseModel):
    """ 鉴权模型
    """
    __tablename__ = "auth"

    userId = Column("user_id", db.String(64), db.ForeignKey('user.id'), nullable=False, comment="用户ID")
    user = db.relationship("User", backref="auths")
    # user = db.relationship("User", back_populates="auths")
    authType = Column("auth_type", db.Enum("account","email","phone","wechat","weibo"), nullable=False, comment="鉴权类型")
    authName = Column("auth_name", db.String(128), nullable=False, comment="鉴权名称")
    authCode = Column("auth_code", db.String(128), comment="鉴权识别码")
    verifyTime = Column("verify_time", db.DateTime, comment="认证时间")
    expireTime = Column("expire_time", db.DateTime, comment="过期时间")
    isEnabled = Column("is_enabled", db.Boolean, default=True, comment="是否启用")

    # @property
    # def password(self):
    #     abort(403,"密码不能读取")

    # @password.setter
    # def password(self, password):
    #     self.authCode = generate_password_hash(password)

    # def check_password(self, password):
    #     return check_password_hash(self.authCode, password)

class AuthSchema(ma.ModelSchema):
    """ 鉴权模式
    """
    class Meta:
        model = Auth
