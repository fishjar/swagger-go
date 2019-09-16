import Sequelize from "sequelize";
import sequelize from "../db";

export default sequelize.define(
  "usergroup",
  {
    id: {
      field: "id",
      comment: "ID",
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    userId: {
      field: "user_id",
      comment: "用户ID",
      type: Sequelize.UUID,
      allowNull: false,
    },
    groupId: {
      field: "group_id",
      comment: "组ID",
      type: Sequelize.UUID,
      allowNull: false,
    },
    level: {
      field: "level",
      comment: "级别",
      type: Sequelize.TINYINT,
      defaultValue: 0,
      validate: {
        isInt: true,
      },
    },
    joinTime: {
      field: "join_time",
      comment: "加入时间",
      type: Sequelize.DATE,
      validate: {
        isDate: true,
      },
    },
  },
  {
    underscored: true, // 使用下划线字段
    paranoid: true, // 软删除
    freezeTableName: true, // 禁用表名自动复数
    tableName: "usergroup", // 定义表的名称
  }
);
