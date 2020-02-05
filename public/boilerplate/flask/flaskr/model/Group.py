import enum

from flaskr import db, ma
from .Base import BaseModel, Column

class Group(BaseModel):
    """ 组模型
    """
    __tablename__ = "group"

    name = Column("name", db.String(32), nullable=False, comment="角色名称")
    leaderId = Column("leader_id", db.String(64), db.ForeignKey('user.id'), nullable=False, comment="队长ID")
    leader = db.relationship("User")
    menbers = db.relationship('User', secondary="user_group", backref="groups")

class GroupSchema(ma.ModelSchema):
    """ 组模式
    """
    class Meta:
        model = Group
