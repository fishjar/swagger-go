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
    int4: ["TINYINT", "SmallInteger", "int"],
    int8: ["SMALLINT", "SmallInteger", "int"],
    int16: ["MEDIUMINT", "Integer", "int"],
    int32: ["INTEGER", "Integer", "int"],
    int64: ["BIGINT", "BigInteger", "int"],
    "time-stamp": ["INTEGER", "TIMESTAMP", "int"],
  },
  number: {
    float: ["FLOAT", "Float", "float32"],
    double: ["DOUBLE", "Float", "float32"],
    decimal: ["DECIMAL", "Numeric", "float32"],
  },
  string: {
    char: ["CHAR", "CHAR", "string"],
    string: ["STRING", "String", "string"],
    text: ["TEXT", "Text", "string"],
    date: ["DATEONLY", "Date", "time.Time"],
    "date-time": ["DATE", "DateTime", "time.Time"],
    // "date-time(6)": ["DATE", "DateTime", "time.Time"],
    email: ["STRING", "String", "string"],
    uri: ["STRING", "String", "string"],
    hostname: ["STRING", "String", "string"],
    ipv4: ["STRING", "String", "string"],
    ipv6: ["STRING", "String", "string"],
    byte: ["STRING", "String", "string"],
    binary: ["STRING.BINARY", "LargeBinary", "string"],
    password: ["STRING", "String", "string"],
    uuid: ["UUID", "String", "string"],
    // json: ["JSON", "JSON", "string"],
  },
  object: {
    object: ["JSON", "JSON", "string"],
  },
  array: {
    array: ["JSON", "JSON", "string"],
  },
  boolean: {
    boolean: ["BOOLEAN", "Boolean", "bool"],
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
    disabled: false,
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
