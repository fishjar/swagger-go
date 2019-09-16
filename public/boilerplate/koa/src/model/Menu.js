import Sequelize from "sequelize";
import sequelize from "../db";

export default sequelize.define(
  "menu",
  {
    id: {
      field: "id",
      comment: "ID",
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    parentId: {
      field: "parent_id",
      comment: "父ID",
      type: Sequelize.UUID,
    },
    name: {
      field: "name",
      comment: "菜单名称",
      type: Sequelize.STRING,
      allowNull: false,
    },
    path: {
      field: "path",
      comment: "菜单路径",
      type: Sequelize.STRING,
      allowNull: false,
    },
    icon: {
      field: "icon",
      comment: "菜单图标",
      type: Sequelize.STRING,
    },
    sort: {
      field: "sort",
      comment: "排序",
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
  },
  {
    underscored: true, // 使用下划线字段
    paranoid: true, // 软删除
    freezeTableName: true, // 禁用表名自动复数
    tableName: "menu", // 定义表的名称
  }
);
