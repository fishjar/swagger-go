import enum

from flaskr import db, ma
from .Base import BaseModel, Column


class UserGroup(BaseModel):
    """ 用户组模型
    """
    __tablename__ = "user_group"

    userId = Column("user_id", db.String(64), db.ForeignKey('user.id'), nullable=False, comment="用户ID")
    groupId = Column("group_id", db.String(64), db.ForeignKey('group.id'), nullable=False, comment="组ID")
    level = Column("level", db.SmallInteger, default=0, comment="级别")
    joinTime = Column("join_time", db.DateTime, comment="加入时间")
    

class UserGroupSchema(ma.ModelSchema):
    """ 用户组模式
    """
    class Meta:
        model = UserGroup
