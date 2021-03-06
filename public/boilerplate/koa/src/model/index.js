import User from "./User";
import Auth from "./Auth";
import Role from "./Role";
import Group from "./Group";
import UserGroup from "./UserGroup";
import Menu from "./Menu";

User.hasMany(Auth, { as: "auths", foreignKey: "userId", sourceKey: "id" });
Auth.belongsTo(User, { as: "user", foreignKey: "userId", targetKey: "id" });

// Menu.hasOne(Menu, { as: "parent", foreignKey: "parentId", sourceKey: "id" });
Menu.hasMany(Menu, { as: "children", foreignKey: "parentId", sourceKey: "id" });
Menu.belongsTo(Menu, { as: "parent", foreignKey: "parentId", targetKey: "id" });


User.belongsToMany(Role, {
  as: "roles",
  through: "userrole",
  foreignKey: "userId",
  otherKey: "roleId",
});
Role.belongsToMany(User, {
  as: "users",
  through: "userrole",
  foreignKey: "roleId",
  otherKey: "userId",
});

Menu.belongsToMany(Role, {
  as: "roles",
  through: "rolemenu",
  foreignKey: "menuId",
  otherKey: "roleId",
});
Role.belongsToMany(Menu, {
  as: "menus",
  through: "rolemenu",
  foreignKey: "roleId",
  otherKey: "menuId",
});

Group.belongsTo(User, {
  as: "leader",
  foreignKey: "leaderId",
  targetKey: "id",
});

UserGroup.belongsTo(User, {
  as: "user",
  foreignKey: "userId",
  targetKey: "id",
});
UserGroup.belongsTo(Group, {
  as: "group",
  foreignKey: "groupId",
  targetKey: "id",
});

User.belongsToMany(Group, {
  as: "groups",
  through: UserGroup,
  foreignKey: "userId",
  otherKey: "groupId",
});
Group.belongsToMany(User, {
  as: "menbers",
  through: UserGroup,
  foreignKey: "groupId",
  otherKey: "userId",
});

User.belongsToMany(User, {
  as: "friends",
  through: "userfriend",
  foreignKey: "userId",
  otherKey: "friendId",
});

export default {
  User,
  Auth,
  Role,
  Group,
  UserGroup,
  Menu,
};
