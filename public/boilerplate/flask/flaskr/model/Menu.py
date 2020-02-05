import enum

from flaskr import db, ma
from .Base import BaseModel, Column

class Menu(BaseModel):
    """ 菜单模型
    """
    __tablename__ = "menu"

    parentId = Column("parent_id", db.String(64), db.ForeignKey('menu.id'), comment="父ID")
    parent = db.relationship("Menu", backref="children", remote_side="Menu.id")
    name = Column("name", db.String(32), nullable=False, comment="菜单名称")
    path = Column("path", db.String(32), nullable=False, comment="菜单路径")
    icon = Column("icon", db.String(32), comment="菜单图标")
    sort = Column("sort", db.Integer, default=0, comment="排序")


class MenuSchema(ma.ModelSchema):
    """ 菜单模式
    """
    class Meta:
        model = Menu
