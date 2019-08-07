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
    key: "findOne",
    notice: "根据条件查找单条",
  },
  {
    method: "post",
    path: "",
    key: "findOrCreate",
    notice: "查找或创建单条",
  },
  {
    method: "get",
    path: "s",
    key: "findAndCountAll",
    notice: "获取多条",
  },
  {
    method: "post",
    path: "s",
    key: "singleCreate",
    notice: "创建单条",
  },
  {
    method: "patch",
    path: "s",
    key: "bulkUpdate",
    notice: "更新多条",
  },
  {
    method: "delete",
    path: "s",
    key: "bulkDestroy",
    notice: "删除多条",
  },
  {
    method: "get",
    path: "s/:id",
    key: "findById",
    notice: "根据ID查找单条",
  },
  {
    method: "patch",
    path: "s/:id",
    key: "updateById",
    notice: "更新单条",
  },
  {
    method: "delete",
    path: "s/:id",
    key: "destroyById",
    notice: "删除单条",
  },
  {
    method: "post",
    path: "s/multiple",
    key: "bulkCreate",
    notice: "创建多条",
  },
];

// https://swagger.io/docs/specification/data-models/data-types/
export const dataTypes = [
  "string",
  "number",
  "integer",
  "boolean",
  "array",
  "object",
];

export const dataFormats = {
  int4: ["integer", "TINYINT", "TINYINT", ""],
  int8: ["integer", "SMALLINT", "SMALLINT"],
  int16: ["integer", "MEDIUMINT", "INTEGER"],
  int32: ["integer", "INTEGER", "INTEGER"],
  int64: ["integer", "BIGINT", "BIGINT"],
  float: ["number", "FLOAT", "FLOAT"],
  double: ["number", "DOUBLE", "FLOAT"],
  decimal: ["number", "DECIMAL", "DECIMAL"],
  char: ["string", "CHAR", "CHAR"],
  string: ["string", "STRING", "VARCHAR"],
  text: ["string", "TEXT", "TEXT"],
  date: ["string", "DATEONLY", "DATE"],
  "date-time": ["string", "DATE", "DATETIME"],
  // "date-time(6)": ["string", "DATE", "DATETIME"],
  "time-stamp": ["integer", "INTEGER", "TIMESTAMP"],
  email: ["string", "STRING", "VARCHAR"],
  uri: ["string", "STRING", "VARCHAR"],
  hostname: ["string", "STRING", "VARCHAR"],
  ipv4: ["string", "STRING", "VARCHAR"],
  ipv6: ["string", "STRING", "VARCHAR"],
  byte: ["string", "BLOB", "BLOB"],
  binary: ["string", "STRING.BINARY", "binary"],
  password: ["string", "STRING", "VARCHAR"],
  uuid: ["string", "UUID", "UUID"],
  json: ["string", "JSON", "JSON"],
  object: ["object", "JSON", "JSON"],
  array: ["array", "JSON", "JSON"],
  boolean: ["boolean", "BOOLEAN", "BOOLEAN"],
  // enum: ["*", "ENUM", "ENUM"],
};

export const numTypes = [
  "int4",
  "int8",
  "int16",
  "int32",
  "int64",
  "float",
  "double",
  "decimal",
  "time-stamp",
];
