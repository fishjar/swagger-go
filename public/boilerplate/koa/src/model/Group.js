import Sequelize from "sequelize";
import sequelize from "../db";

export default sequelize.define(
  "group",
  {
    id: {
      field: "id",
      comment: "ID",
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: {
      field: "name",
      comment: "组名称",
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
    tableName: "group", // 定义表的名称
  }
);
