// https://swagger.io/docs/specification/data-models/data-types/

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
