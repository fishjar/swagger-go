from flask import Blueprint
from flaskr.handler import Login, User, Role, Auth, Menu, Group, UserGroup

# 创建蓝图
login = Blueprint("login", "Login")
user = Blueprint("user", "User")
role = Blueprint("role", "Role")
auth = Blueprint("auth", "Auth")
menu = Blueprint("menu", "Menu")
group = Blueprint("group", "Group")
usergroup = Blueprint("usergroup", "UserGroup")

# 绑定路由
login.add_url_rule("/login/account", view_func=Login.account, methods=("POST",))

user.add_url_rule("/users", view_func=User.findAndCountAll, methods=("GET",))
user.add_url_rule("/users", view_func=User.singleCreate, methods=("POST",))
user.add_url_rule("/users", view_func=User.bulkUpdate, methods=("PATCH",))
user.add_url_rule("/users", view_func=User.bulkDestroy, methods=("DELETE",))
user.add_url_rule("/users/<string:id>", view_func=User.findByPk, methods=("GET",))
user.add_url_rule("/users/<string:id>", view_func=User.updateByPk, methods=("PATCH",))
user.add_url_rule("/users/<string:id>", view_func=User.destroyByPk, methods=("DELETE",))
user.add_url_rule("/users/multiple", view_func=User.bulkCreate, methods=("POST",))

role.add_url_rule("/roles", view_func=Role.findAndCountAll, methods=("GET",))
role.add_url_rule("/roles", view_func=Role.singleCreate, methods=("POST",))
role.add_url_rule("/roles", view_func=Role.bulkUpdate, methods=("PATCH",))
role.add_url_rule("/roles", view_func=Role.bulkDestroy, methods=("DELETE",))
role.add_url_rule("/roles/<string:id>", view_func=Role.findByPk, methods=("GET",))
role.add_url_rule("/roles/<string:id>", view_func=Role.updateByPk, methods=("PATCH",))
role.add_url_rule("/roles/<string:id>", view_func=Role.destroyByPk, methods=("DELETE",))
role.add_url_rule("/roles/multiple", view_func=Role.bulkCreate, methods=("POST",))

auth.add_url_rule("/auths", view_func=Auth.findAndCountAll, methods=("GET",))
auth.add_url_rule("/auths", view_func=Auth.singleCreate, methods=("POST",))
auth.add_url_rule("/auths", view_func=Auth.bulkUpdate, methods=("PATCH",))
auth.add_url_rule("/auths", view_func=Auth.bulkDestroy, methods=("DELETE",))
auth.add_url_rule("/auths/<string:id>", view_func=Auth.findByPk, methods=("GET",))
auth.add_url_rule("/auths/<string:id>", view_func=Auth.updateByPk, methods=("PATCH",))
auth.add_url_rule("/auths/<string:id>", view_func=Auth.destroyByPk, methods=("DELETE",))
auth.add_url_rule("/auths/multiple", view_func=Auth.bulkCreate, methods=("POST",))

menu.add_url_rule("/menus", view_func=Menu.findAndCountAll, methods=("GET",))
menu.add_url_rule("/menus", view_func=Menu.singleCreate, methods=("POST",))
menu.add_url_rule("/menus", view_func=Menu.bulkUpdate, methods=("PATCH",))
menu.add_url_rule("/menus", view_func=Menu.bulkDestroy, methods=("DELETE",))
menu.add_url_rule("/menus/<string:id>", view_func=Menu.findByPk, methods=("GET",))
menu.add_url_rule("/menus/<string:id>", view_func=Menu.updateByPk, methods=("PATCH",))
menu.add_url_rule("/menus/<string:id>", view_func=Menu.destroyByPk, methods=("DELETE",))
menu.add_url_rule("/menus/multiple", view_func=Menu.bulkCreate, methods=("POST",))

group.add_url_rule("/groups", view_func=Group.findAndCountAll, methods=("GET",))
group.add_url_rule("/groups", view_func=Group.singleCreate, methods=("POST",))
group.add_url_rule("/groups", view_func=Group.bulkUpdate, methods=("PATCH",))
group.add_url_rule("/groups", view_func=Group.bulkDestroy, methods=("DELETE",))
group.add_url_rule("/groups/<string:id>", view_func=Group.findByPk, methods=("GET",))
group.add_url_rule("/groups/<string:id>", view_func=Group.updateByPk, methods=("PATCH",))
group.add_url_rule("/groups/<string:id>", view_func=Group.destroyByPk, methods=("DELETE",))
group.add_url_rule("/groups/multiple", view_func=Group.bulkCreate, methods=("POST",))

usergroup.add_url_rule("/usergroups", view_func=UserGroup.findAndCountAll, methods=("GET",))
usergroup.add_url_rule("/usergroups", view_func=UserGroup.singleCreate, methods=("POST",))
usergroup.add_url_rule("/usergroups", view_func=UserGroup.bulkUpdate, methods=("PATCH",))
usergroup.add_url_rule("/usergroups", view_func=UserGroup.bulkDestroy, methods=("DELETE",))
usergroup.add_url_rule("/usergroups/<string:id>", view_func=UserGroup.findByPk, methods=("GET",))
usergroup.add_url_rule("/usergroups/<string:id>", view_func=UserGroup.updateByPk, methods=("PATCH",))
usergroup.add_url_rule("/usergroups/<string:id>", view_func=UserGroup.destroyByPk, methods=("DELETE",))
usergroup.add_url_rule("/usergroups/multiple", view_func=UserGroup.bulkCreate, methods=("POST",))
