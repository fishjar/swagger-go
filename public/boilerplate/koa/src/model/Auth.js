import Sequelize from "sequelize";
import sequelize from "../db";
import User from "./User";

export default sequelize.define(
  "auth",
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
      references: {
        model: User,
        key: "id",
      },
    },
    authType: {
      field: "auth_type",
      comment: "鉴权类型",
      type: Sequelize.STRING(16),
      allowNull: false,
      validate: {
        isIn: [["account", "email", "phone", "wechat", "weibo"]],
      },
    },
    authName: {
      field: "auth_name",
      comment: "鉴权名称",
      type: Sequelize.STRING(128),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    authCode: {
      field: "auth_code",
      comment: "鉴权识别码",
      type: Sequelize.STRING,
    },
    verifyTime: {
      field: "verify_time",
      comment: "认证时间",
      type: Sequelize.DATE,
      validate: {
        isDate: true,
      },
    },
    expireTime: {
      field: "expire_time",
      comment: "过期时间",
      type: Sequelize.DATE,
    },
    isEnabled: {
      field: "is_enabled",
      comment: "是否启用",
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    underscored: true, // 使用下划线字段
    paranoid: true, // 软删除
    freezeTableName: true, // 禁用表名自动复数
    tableName: "auth", // 定义表的名称
  }
);
