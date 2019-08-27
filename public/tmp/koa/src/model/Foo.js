import Sequelize from "sequelize";
import sequelize from "../db";

const Foo = sequelize.define(
  "Foo",
  {
    id: {
      field: "id",
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    name: {
      field: "name",
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 20]
      }
    },
    birthday: {
      field: "birthday",
      type: Sequelize.DATEONLY,
      allowNull: true
    },
    goodTime: {
      field: "good_time",
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    age: {
      field: "age",
      type: Sequelize.TINYINT,
      allowNull: true,
      validate: {
        max: 100,
        min: 0
      }
    },
    weight: {
      field: "weight",
      type: Sequelize.FLOAT,
      allowNull: true,
      unique: false,
      validate: {
        min: 0.01,
        max: 200
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
    homepage: {
      field: "homepage",
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    notice: {
      field: "notice",
      type: Sequelize.TEXT,
      allowNull: true
    },
    intro: {
      field: "intro",
      type: Sequelize.TEXT,
      allowNull: true
    },
    isGood: {
      field: "is_good",
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    myExtra: {
      field: "my_extra",
      type: Sequelize.JSON,
      allowNull: true
    },
    status: {
      field: "status",
      type: Sequelize.TINYINT,
      validate: {
        isIn: [[1, 2, 3]]
      },
      allowNull: false
    }
  },
  {
    underscored: true, // 下划线字段
    paranoid: true, // 软删除
    freezeTableName: true, // 禁用修改表名
    tableName: "foo" // 定义表的名称
  }
);

export default Foo;
