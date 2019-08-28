import Sequelize from "sequelize";
import sequelize from "../db";

const User = sequelize.define(
  "User",
  {
    id: {
      field: "id",
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    userName: {
      field: "user_name",
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 20]
      }
    },
    userType: {
      field: "user_type",
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      field: "password",
      type: Sequelize.STRING,
      allowNull: false
    },
    name: {
      field: "name",
      type: Sequelize.STRING,
      allowNull: true
    },
    age: {
      field: "age",
      type: Sequelize.TINYINT,
      allowNull: true,
      validate: {
        max: 100,
        min: 18
      }
    },
    email: {
      field: "email",
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    birthday: {
      field: "birthday",
      type: Sequelize.DATEONLY,
      allowNull: true
    }
  },
  {
    underscored: true, // 下划线字段
    paranoid: true, // 软删除
    freezeTableName: true, // 禁用修改表名
    tableName: "user" // 定义表的名称
  }
);

export default User;
