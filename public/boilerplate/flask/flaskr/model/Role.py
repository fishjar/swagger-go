import enum

from flaskr import db, ma
from .Base import BaseModel, Column


role_menu = db.Table('role_menu',
                     Column('role_id', db.String(64), db.ForeignKey('role.id')),
                     Column('menu_id', db.String(64), db.ForeignKey('menu.id'))
                     )


class Role(BaseModel):
    """ 角色模型
    """
    __tablename__ = "role"

    name = Column("name", db.String(32), nullable=False, comment="角色名称")
    menus = db.relationship('Menu', secondary=role_menu, backref="roles")


class RoleSchema(ma.ModelSchema):
    """ 角色模式
    """
    class Meta:
        model = Role
