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
    key: "findById",
    notice: "根据ID查找单条",
  },
  {
    method: "patch",
    path: "/:id",
    plural: true,
    key: "updateById",
    notice: "更新单条",
  },
  {
    method: "delete",
    path: "/:id",
    plural: true,
    key: "destroyById",
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
export const dataTypes = {
  integer: {
    int4: ["TINYINT", "TINYINT"],
    int8: ["SMALLINT", "SMALLINT"],
    int16: ["MEDIUMINT", "INTEGER"],
    int32: ["INTEGER", "INTEGER"],
    int64: ["BIGINT", "BIGINT"],
    "time-stamp": ["INTEGER", "TIMESTAMP"],
  },
  number: {
    float: ["FLOAT", "FLOAT"],
    double: ["DOUBLE", "FLOAT"],
    decimal: ["DECIMAL", "DECIMAL"],
  },
  string: {
    char: ["CHAR", "CHAR"],
    string: ["STRING", "VARCHAR"],
    text: ["TEXT", "TEXT"],
    date: ["DATEONLY", "DATE"],
    "date-time": ["DATE", "DATETIME"],
    // "date-time(6)": ["DATE", "DATETIME"],
    email: ["STRING", "VARCHAR"],
    uri: ["STRING", "VARCHAR"],
    hostname: ["STRING", "VARCHAR"],
    ipv4: ["STRING", "VARCHAR"],
    ipv6: ["STRING", "VARCHAR"],
    byte: ["STRING", "VARCHAR"],
    binary: ["STRING.BINARY", "binary"],
    password: ["STRING", "VARCHAR"],
    uuid: ["UUID", "UUID"],
    json: ["JSON", "JSON"],
  },
  object: {
    object: ["JSON", "JSON"],
  },
  array: {
    array: ["JSON", "JSON"],
  },
  boolean: {
    boolean: ["BOOLEAN", "BOOLEAN"],
  },
};

export const dataTypesTable = Object.entries(dataTypes)
  .map(([key, value]) => Object.entries(value).map(([k, v]) => [key, k, ...v]))
  .reduce((accumulator, currentValue) => [...accumulator, ...currentValue]);

export const dataFormats = Object.assign(
  ...Object.entries(dataTypes).map(([_, item]) => item)
);

export const standDataTypes = Object.keys(dataTypes);
