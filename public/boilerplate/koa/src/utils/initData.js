import model from "../model";
import config from "../config";
import sign from "../utils/sign";

const { DEFAULT_USERNAME, DEFAULT_PASSWORD } = config;

export default async () => {
  // 创建默认用户
  const [user, created] = await model.User.findOrCreate({
    where: { name: DEFAULT_USERNAME },
  });

  // 新数据库
  if (created) {
    // 创建测试用户
    const jack = await model.User.create({ name: "jack" });
    const rose = await model.User.create({ name: "rose" });
    const deluser = await model.User.create({ name: "deluser" });
    await deluser.destroy();

    // 创建角色
    const adminRole = await model.Role.create({ name: "admin" });
    const userRole = await model.Role.create({ name: "user" });
    const guestRole = await model.Role.create({ name: "guest" });

    // 创建团队
    const titanicGroup = await model.Group.create({
      name: "titanic",
      leaderId: jack.id,
    });
    const rayjarGroup = await model.Group.create({
      name: "rayjar",
      leaderId: user.id,
    });

    // 创建菜单
    const dashboardMenu = await model.Menu.create({
      name: "dashboard",
      path: "/dashboard",
      icon: "dashboard",
      sort: 0,
    });
    const indexMenu = await model.Menu.create({
      parentId: dashboardMenu.id,
      name: "index",
      path: "/dashboard/index",
      sort: 0,
    });
    const modelsMenu = await model.Menu.create({
      name: "models",
      path: "/models",
      icon: "table",
      sort: 1,
    });
    const usersMenu = await model.Menu.create({
      parentId: modelsMenu.id,
      name: "user",
      path: "/models/user",
      sort: 0,
    });
    const authsMenu = await model.Menu.create({
      parentId: modelsMenu.id,
      name: "auth",
      path: "/models/auth",
      sort: 1,
    });
    const rolesMenu = await model.Menu.create({
      parentId: modelsMenu.id,
      name: "role",
      path: "/models/role",
      sort: 2,
    });
    const groupsMenu = await model.Menu.create({
      parentId: modelsMenu.id,
      name: "group",
      path: "/models/group",
      sort: 3,
    });
    const menusMenu = await model.Menu.create({
      parentId: modelsMenu.id,
      name: "menu",
      path: "/models/menu",
      sort: 5,
    });
    const usergroupsMenu = await model.Menu.create({
      parentId: modelsMenu.id,
      name: "usergroup",
      path: "/models/usergroup",
      sort: 4,
    });

    // 关联角色菜单
    await adminRole.addMenu(dashboardMenu);
    await adminRole.addMenu(indexMenu);
    await adminRole.addMenu(modelsMenu);
    await adminRole.addMenu(usersMenu);
    await adminRole.addMenu(authsMenu);
    await adminRole.addMenu(rolesMenu);
    await adminRole.addMenu(groupsMenu);
    await adminRole.addMenu(menusMenu);
    await adminRole.addMenu(usergroupsMenu);
    await userRole.addMenu(dashboardMenu);
    await userRole.addMenu(indexMenu);

    // 关联用户角色
    await user.addRole(userRole);
    await user.addRole(adminRole);
    await user.addRole(guestRole);
    await jack.addRole(userRole);
    await jack.addRole(guestRole);
    await rose.addRole(guestRole);

    // 关联用户团队
    await user.addGroup(rayjarGroup, {
      through: { level: 10, joinTime: new Date() },
    });
    await jack.addGroup(rayjarGroup, {
      through: { level: 2, joinTime: new Date() },
    });
    await jack.addGroup(titanicGroup, {
      through: { level: 2, joinTime: new Date() },
    });
    await rose.addGroup(titanicGroup, {
      through: { level: 3, joinTime: new Date() },
    });

    // 关联用户友谊
    await user.addFriend(jack);
    await user.addFriend(rose);
    await jack.addFriend(rose);

    // 创建测试鉴权
    await model.Auth.create({
      userId: jack.id,
      authType: "account",
      authName: jack.name,
      authCode: sign.signPwd(jack.name, DEFAULT_PASSWORD),
      verifyTime: new Date(),
      expireTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    });
    console.log("\n测试帐号");
    console.log(`username: ${jack.name}`);
    console.log(`password: ${DEFAULT_PASSWORD}\n`);

    // 创建默认鉴权
    await model.Auth.create({
      userId: user.id,
      authType: "account",
      authName: DEFAULT_USERNAME,
      authCode: sign.signPwd(DEFAULT_USERNAME, DEFAULT_PASSWORD),
      verifyTime: new Date(),
      expireTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    });
    console.log("\n默认帐号");
    console.log(`username: ${DEFAULT_USERNAME}`);
    console.log(`password: ${DEFAULT_PASSWORD}\n`);
  }
};
