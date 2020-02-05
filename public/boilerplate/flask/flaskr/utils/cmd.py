import click
import datetime
from flask.cli import with_appcontext
from werkzeug.security import generate_password_hash, check_password_hash


def init_app(app):
    """初始化"""
    app.cli.add_command(init_db_command)


@click.command("init-db")
@with_appcontext
def init_db_command():
    """数据初始化"""
    init_db()
    click.echo("初始化完成!")


def init_db():
    """创建初始数据"""
    from flaskr import db

    print("\n\n\n\n---------删除表-----------")
    db.drop_all()
    print("\n\n\n\n---------创建表-----------")
    db.create_all()

    # 创建用户
    print("\n\n\n\n---------创建用户-----------")
    from flaskr.model import User
    gabe = User(name='gabe')
    jack = User(name='jack')
    rose = User(name='rose')
    # db.session.add(gabe)
    # db.session.add(jack)
    # db.session.add(rose)
    db.session.add_all([gabe, jack, rose])
    db.session.commit()

    # 创建角色
    print("\n\n\n\n---------创建角色-----------")
    from flaskr.model import Role
    adminRole = Role(name='admin')
    userRole = Role(name='user')
    guestRole = Role(name='guest')
    db.session.add_all([adminRole, userRole, guestRole])
    db.session.commit()

    # 创建团队
    print("\n\n\n\n---------创建团队-----------")
    from flaskr.model import Group
    rayjarGroup = Group(name="rayjar",leader=gabe)
    titanicGroup = Group(name="titanic",leader=jack)
    db.session.add_all([rayjarGroup, titanicGroup])
    db.session.commit()

    # 创建菜单
    print("\n\n\n\n---------创建菜单-----------")
    from flaskr.model import Menu
    welcomeMenu = Menu(name="welcome",path="/welcome",icon="smile",sort=0)
    dashboardMenu = Menu(name="dashboard",path="/dashboard",icon="dashboard",sort=1)
    db.session.add_all([welcomeMenu, welcomeMenu])
    db.session.commit()

    usersMenu = Menu(name="users",path="/dashboard/users",sort=0,parent=dashboardMenu)
    authsMenu = Menu(name="auths",path="/dashboard/auths",sort=0,parent=dashboardMenu)
    rolesMenu = Menu(name="roles",path="/dashboard/roles",sort=0,parent=dashboardMenu)
    menusMenu = Menu(name="groups",path="/dashboard/groups",sort=0,parent=dashboardMenu)
    groupsMenu = Menu(name="menus",path="/dashboard/menus",sort=0,parent=dashboardMenu)
    usergroupsMenu = Menu(name="usergroups",path="/dashboard/usergroups",sort=0,parent=dashboardMenu)

    db.session.add_all([usersMenu, authsMenu, rolesMenu, menusMenu, groupsMenu, usergroupsMenu])
    db.session.commit()

    # 关联角色菜单
    print("\n\n\n\n---------关联角色菜单-----------")
    adminRole.menus = [welcomeMenu,dashboardMenu,usersMenu,authsMenu,rolesMenu,menusMenu, groupsMenu, usergroupsMenu]
    userRole.menus = [welcomeMenu,dashboardMenu,usersMenu,menusMenu]
    db.session.commit()

    # 关联用户角色
    print("\n\n\n\n---------关联用户角色-----------")
    gabe.roles = [adminRole, userRole, guestRole]
    jack.roles = [userRole, guestRole]
    rose.roles = [guestRole]
    db.session.commit()

    # 关联用户团队
    print("\n\n\n\n---------关联用户团队-----------")
    # gabe.groups = [rayjarGroup]
    # jack.groups = [rayjarGroup,titanicGroup]
    # rose.groups = [titanicGroup]
    rayjarGroup.menbers = [gabe,jack]
    titanicGroup.menbers = [jack,rose]
    db.session.commit()

    # 创建帐号
    print("\n\n\n\n---------创建帐号-----------")
    from flaskr.model import Auth
    authData = {
        "user": gabe,
        "authType": "account",
        "authName": gabe.name,
        "authCode": generate_password_hash("123456"),
        # "password": "123456",
        "verifyTime": datetime.datetime.utcnow(),
        "expireTime": datetime.datetime.utcnow() + datetime.timedelta(seconds=60*60*24)
    }
    auth = Auth(**authData)
    db.session.add(auth)
    db.session.commit()
