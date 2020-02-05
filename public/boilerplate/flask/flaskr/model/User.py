import enum

from flaskr import db, ma
from sqlalchemy.orm import validates
from schema import Schema, And, Or, Regex
from .Base import BaseModel, Column


user_role = db.Table('user_role',
                     Column('user_id', db.String(64), db.ForeignKey('user.id')),
                     Column('role_id', db.String(64), db.ForeignKey('role.id'))
                     )


class User(BaseModel):
    """ 用户模型
    """
    __tablename__ = "user"

    name = Column("name", db.String(32), nullable=False, comment="名字", validator=(
        Schema(And(str, lambda v: len(v) >= 3 and len(v) <= 20)), "长度必须3~20位"))
    nickname = Column("nickname", db.String(64), comment="昵称")
    gender = Column("gender", db.SmallInteger, comment="性别", validator=(
        Schema(lambda v: v in set([0, 1, 2])), "值须为[0, 1, 2]之一"))
    avatar = Column("avatar", db.String(256), comment="头像")
    mobile = Column("mobile", db.String(16), comment="手机")
    email = Column("email", db.String(32), comment="邮箱", validator=(
        Regex(r"^[A-Za-z0-9\.\+_-]+@[A-Za-z0-9\._-]+\.[a-zA-Z]*$"), "格式不正确"))
    homepage = Column("homepage", db.String(256), comment="个人主页")
    birthday = Column("birthday", db.Date, comment="生日")
    height = Column("height", db.Float, comment="身高(cm)")
    bloodType = Column("blood_type", db.Enum("A", "B", "AB", "O", "NULL"), comment="血型(ABO)", validator=(
        Schema(lambda v: v in set(["A", "B", "AB", "O", "NULL"])), "值必须为[A,B,AB,O,NULL]之一"))
    notice = Column("notice", db.Text, comment="备注")
    intro = Column("intro", db.Text, comment="简介")
    address = Column("address", db.JSON, comment="地址")
    lives = Column("lives", db.JSON, comment="生活轨迹")
    tags = Column("tags", db.JSON, comment="标签")
    luckyNumbers = Column("lucky_numbers", db.JSON, comment="幸运数字")
    score = Column("score", db.Integer, comment="积分",
                   validator=(Schema(int), "必须为整数"))
    userNo = Column("user_no", db.Integer, autoincrement=True, comment="编号")
    roles = db.relationship('Role', secondary=user_role, backref="users")

    # @validates('gender')
    # def validate_gender(self, k, v):
    #     """验证性别"""
    #     assert v in [0, 1, 2], "性别参数错误，须为[0, 1, 2]之一"
    #     return v

    # @validates('email')
    # def validate_email(self, k, v):
    #     """验证邮箱"""
    #     assert '@' in v, "邮箱格式错误"
    #     return v


class UserSchema(ma.ModelSchema):
    """ 用户模式
    """
    class Meta:
        model = User
