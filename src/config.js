export const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

export const apiOptions = [
  {
    method: "get",
    path: "",
    plural: false,
    key: "findOne",
    notice: "根据条件查找单条",
  },
  {
    method: "post",
    path: "",
    plural: false,
    key: "findOrCreate",
    notice: "查找或创建单条",
  },
  {
    method: "get",
    path: "",
    plural: true,
    key: "findAndCountAll",
    notice: "获取多条",
  },
  {
    method: "post",
    path: "",
    plural: true,
    key: "singleCreate",
    notice: "创建单条",
  },
  {
    method: "patch",
    path: "",
    plural: true,
    key: "bulkUpdate",
    notice: "更新多条",
  },
  {
    method: "delete",
    path: "",
    plural: true,
    key: "bulkDestroy",
    notice: "删除多条",
  },
  {
    method: "get",
    path: "/:id",
    plural: true,
    key: "findByPk",
    notice: "根据ID查找单条",
  },
  {
    method: "patch",
    path: "/:id",
    plural: true,
    key: "updateByPk",
    notice: "更新单条",
  },
  {
    method: "delete",
    path: "/:id",
    plural: true,
    key: "destroyByPk",
    notice: "删除单条",
  },
  {
    method: "post",
    path: "/multiple",
    plural: true,
    key: "bulkCreate",
    notice: "创建多条",
  },
];

// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md
// https://swagger.io/docs/specification/data-models/data-types/
// [Sequelize, SQLAlchemy, gorm]
export const dataTypes = {
  integer: {
    int4: ["TINYINT", "TINYINT", "int"],
    int8: ["SMALLINT", "SMALLINT", "int"],
    int16: ["MEDIUMINT", "INTEGER", "int"],
    int32: ["INTEGER", "INTEGER", "int"],
    int64: ["BIGINT", "BIGINT", "int"],
    "time-stamp": ["INTEGER", "TIMESTAMP", "int"],
  },
  number: {
    float: ["FLOAT", "FLOAT", "float32"],
    double: ["DOUBLE", "FLOAT", "float32"],
    decimal: ["DECIMAL", "DECIMAL", "float32"],
  },
  string: {
    char: ["CHAR", "CHAR", "string"],
    string: ["STRING", "VARCHAR", "string"],
    text: ["TEXT", "TEXT", "string"],
    date: ["DATEONLY", "DATE", "time.Time"],
    "date-time": ["DATE", "DATETIME", "time.Time"],
    // "date-time(6)": ["DATE", "DATETIME", "time.Time"],
    email: ["STRING", "VARCHAR", "string"],
    uri: ["STRING", "VARCHAR", "string"],
    hostname: ["STRING", "VARCHAR", "string"],
    ipv4: ["STRING", "VARCHAR", "string"],
    ipv6: ["STRING", "VARCHAR", "string"],
    byte: ["STRING", "VARCHAR", "string"],
    binary: ["STRING.BINARY", "binary", "string"],
    password: ["STRING", "VARCHAR", "string"],
    uuid: ["UUID", "UUID", "string"],
    // json: ["JSON", "JSON", "string"],
  },
  object: {
    object: ["JSON", "JSON", "string"],
  },
  array: {
    array: ["JSON", "JSON", "string"],
  },
  boolean: {
    boolean: ["BOOLEAN", "BOOLEAN", "bool"],
  },
};

export const dataTypesTable = Object.entries(dataTypes)
  .map(([key, value]) => Object.entries(value).map(([k, v]) => [key, k, ...v]))
  .reduce((accumulator, currentValue) => [...accumulator, ...currentValue]);

export const dataFormats = Object.assign(
  ...Object.entries(dataTypes).map(([_, item]) => item)
);

export const standDataTypes = Object.keys(dataTypes);

export const defaultBoilerplates = {
  koa: {
    language: "nodejs",
    url: "fishjar/koa-rest-boilerplate",
    disabled: false,
  },
  antd: {
    language: "nodejs",
    url: "fishjar/antd-admin-bolierplate",
    disabled: false,
  },
  flask: {
    language: "python",
    url: "fishjar/flask-rest-boilerplate",
    disabled: true,
  },
  gin: {
    language: "go",
    url: "fishjar/gin-rest-boilerplate",
    disabled: false,
  },
};

export const associationTypes = {
  hasOne: "sourceKey",
  hasMany: "sourceKey",
  belongsTo: "targetKey",
  belongsToMany: "otherKey",
};

export const httpMethods = [
  "get",
  "post",
  "put",
  "patch",
  "delete",
  // "head",
  // "options",
];

export const parameterTypes = [
  "path",
  "query",
  "body",
  "header",
  "cookie",
  "formData",
];
