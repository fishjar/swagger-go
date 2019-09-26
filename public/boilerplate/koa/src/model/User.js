import Sequelize from "sequelize";
import sequelize from "../db";

export default sequelize.define(
  "user",
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
      comment: "姓名",
      type: Sequelize.STRING(32),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 20],
      },
    },
    nickname: {
      field: "nickname",
      comment: "昵称",
      type: Sequelize.STRING(64),
    },
    gender: {
      field: "gender",
      comment: "性别",
      type: Sequelize.TINYINT,
      validate: {
        isIn: [[0, 1, 2]], // 保密|男|女
      },
    },
    avatar: {
      field: "avatar",
      comment: "头像",
      type: Sequelize.STRING,
    },
    mobile: {
      field: "mobile",
      comment: "手机",
      type: Sequelize.STRING(16),
    },
    email: {
      field: "email",
      comment: "邮箱",
      type: Sequelize.STRING,
      validate: {
        isEmail: true,
      },
    },
    homepage: {
      field: "homepage",
      comment: "个人主页",
      type: Sequelize.STRING,
      validate: {
        isUrl: true,
      },
    },
    birthday: {
      field: "birthday",
      comment: "生日",
      type: Sequelize.DATEONLY,
      validate: {
        isDate: true,
      },
    },
    height: {
      field: "height",
      comment: "身高(cm)",
      type: Sequelize.FLOAT,
      validate: {
        min: 0,
        max: 300,
        isFloat: true,
      },
    },
    bloodType: {
      field: "blood_type",
      comment: "血型(ABO)",
      type: Sequelize.STRING(8),
      validate: {
        isIn: [["A", "B", "AB", "O", "NULL"]],
      },
    },
    notice: {
      field: "notice",
      comment: "备注",
      type: Sequelize.TEXT,
    },
    intro: {
      field: "intro",
      comment: "简介",
      type: Sequelize.TEXT, // RichText
    },
    address: {
      field: "address",
      comment: "地址",
      type: Sequelize.JSON, // {province,city}
    },
    lives: {
      field: "lives",
      comment: "生活轨迹",
      type: Sequelize.JSON, // [{x,y}]
    },
    tags: {
      field: "tags",
      comment: "标签",
      type: Sequelize.JSON, // ["string"]
    },
    luckyNumbers: {
      field: "lucky_numbers",
      comment: "幸运数字",
      type: Sequelize.JSON, // [1,2]
    },
    score: {
      field: "score",
      comment: "积分",
      type: Sequelize.INTEGER,
      defaultValue: 0,
      validate: {
        isInt: true,
        // 自定义验证器的示例:
        isPlus(value) {
          if (value < 0) {
            throw new Error("积分不能为负数!");
          }
        },
      },
    },
    userNo: {
      field: "user_no",
      comment: "编号",
      type: Sequelize.INTEGER,
      autoIncrement: true, // slqlite 无效？
    },
  },
  {
    underscored: true, // 使用下划线字段
    paranoid: true, // 软删除
    freezeTableName: true, // 禁用表名自动复数
    tableName: "user", // 定义表的名称
  }
);
