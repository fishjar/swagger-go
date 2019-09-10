import User from "./User";
import Auth from "./Auth";
import Role from "./Role";
import Group from "./Group";
import UserGroup from "./UserGroup";

User.hasMany(Auth, { as: "auths", foreignKey: "userId", sourceKey: "id" });
Auth.belongsTo(User, { as: "user", foreignKey: "userId", targetKey: "id" });

Role.hasOne(Role, { as: "child", foreignKey: "parentId", sourceKey: "id" });
Role.belongsTo(Role, { as: "parent", foreignKey: "parentId", targetKey: "id" });

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

User.belongsToMany(Group, {
  as: "groups",
  through: UserGroup,
  foreignKey: "userId",
  otherKey: "groupId",
});
Group.belongsToMany(User, {
  as: "users",
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
};
