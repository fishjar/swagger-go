import Sequelize from "sequelize";
import sequelize from "../db";

export default sequelize.define(
  "role",
  {
    id: {
      field: "id",
      comment: "ID",
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    // parentId: {
    //   field: "parent_id",
    //   comment: "父ID",
    //   type: Sequelize.UUID,
    // },
    name: {
      field: "name",
      comment: "角色名称",
      type: Sequelize.STRING(32),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [3, 20],
      },
    },
  },
  {
    underscored: true, // 使用下划线字段
    paranoid: true, // 软删除
    freezeTableName: true, // 禁用表名自动复数
    tableName: "role", // 定义表的名称
  }
);
