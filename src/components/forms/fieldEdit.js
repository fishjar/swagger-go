import React, { Fragment, useState, useEffect, forwardRef } from "react";
import moment from "moment";
import {
  formItemLayout,
  dataFormats,
  dataTypes,
  numTypes,
  standDataTypes,
} from "../../config";
import { getModelProps, parseRef, hasDuplication } from "../../utils";
import SubFields from "./subFields";
import EnumItems from "./enumItems";
import {
  Form,
  Input,
  Checkbox,
  Card,
  Icon,
  Button,
  Radio,
  Modal,
  Collapse,
  Table,
  Divider,
  Popconfirm,
  Badge,
  Drawer,
  Select,
  InputNumber,
  DatePicker,
  message,
  Switch,
} from "antd";
const { Panel } = Collapse;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;
const InputGroup = Input.Group;
const { TextArea } = Input;

function FieldEdit({
  children,
  title = "编辑",
  formMode,
  dispatch,
  models,
  model,
  fields,
  field,
  form,
}) {
  const {
    getFieldDecorator,
    setFieldsValue,
    getFieldValue,
    resetFields,
  } = form;

  /**
   * 设置state hooks
   */
  const [visible, setVisible] = useState(false); // 抽屉是否可见

  // const [isRef, setRef] = useState(field.isRef);
  // const [isEnum, setEnum] = useState(field.isEnum);
  // const [isRequired, setRequired] = useState(field.isRequired);
  // const [isExample, setExample] = useState(field.isExample);

  // const [refModel, setRefModel] = useState(field.refModel);
  const [refFields, setRefFields] = useState(field.refFields);
  // const [arrayRef, setArrayRef] = useState(field.arrayRef);
  // const [arrayModel, setArrayModel] = useState(field.arrayModel);
  const [arrayFields, setArrayFields] = useState(field.arrayFields);
  // const [subFields, setSubFields] = useState(field.subFields);
  // const [enumItems, setEnumItems] = useState(field.enumItems);

  /**
   * 关闭抽屉
   */
  function handleHide() {
    handleReset();
    setVisible(false);
  }

  /**
   * 打开抽屉
   */
  function handleShow() {
    setVisible(true);
  }

  /**
   * 重置表单
   */
  function handleReset() {
    resetFields();

    // setRef(field.isRef);
    // setEnum(field.isEnum);
    // setRequired(field.isRequired);
    // setExample(field.isExample);

    // setRefModel(field.refModel);
    setRefFields(field.refFields);
    // setArrayRef(field.arrayRef);
    // setArrayModel(field.arrayModel);
    setArrayFields(field.arrayFields);
    // setSubFields(field.subFields);
    // setEnumItems(field.enumItems);
  }

  /**
   * 提交表单
   */
  function handleSubmit(e) {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        message.error("表单填写有问题？");
        return;
      }
      console.log(values);
      // updateData(values);
      // handleHide();
    });
  }

  function handleFieldKeyValidator(rule, value, callback) {
    if (fields.map(item => item.key).includes(value) && formMode === "create") {
      callback("字段名称重复");
    }
    callback();
  }

  function handleSubFieldsValidator(rule, value, callback) {
    const validValue = value.filter(item => item.key);
    if (validValue.length < 1) {
      callback("有效子字段不能少于两项");
    }
    if (hasDuplication(validValue)) {
      callback("子字段名称重复");
    }
    callback();
  }

  function handleEnumItemsValidator(rule, value, callback) {
    const validValue = value.filter(item => item.key);
    if (validValue.length < 2) {
      callback("有效子字段不能少于两项");
    }
    if (hasDuplication(validValue)) {
      callback("子字段名称重复");
    }
    callback();
  }

  function handleObjectModelChange(ref) {
    const [_, subFields] = parseRef(models, ref);
    setFieldsValue({ subFields });
  }

  function handleRefModelChange(ref) {
    const [_, newRefFields] = parseRef(models, ref);
    setRefFields(newRefFields);
  }

  /**
   * 选择数组类型的数据模型
   * @param {String} value
   */
  function handleArrayModelChange(ref) {
    const [_, newArrayFields] = parseRef(models, ref);
    setArrayFields(newArrayFields);
  }

  return (
    <span>
      <span
        onClick={handleShow}
        style={{
          cursor: "pointer",
        }}
      >
        {children}
      </span>
      <Drawer
        destroyOnClose
        title={title}
        width="60%"
        onClose={handleHide}
        visible={visible}
      >
        <Form {...formItemLayout}>
          <Form.Item label="字段名" hasFeedback>
            {getFieldDecorator("key", {
              initialValue: field.key,
              rules: [
                {
                  required: true,
                  message: "请填写!",
                },
                {
                  validator: handleFieldKeyValidator,
                },
              ],
            })(
              <Input placeholder="field_key" disabled={formMode === "edit"} />
            )}
          </Form.Item>

          <Form.Item label="外链模型" required>
            {getFieldDecorator("isRef", {
              initialValue: field.isRef,
              valuePropName: "checked",
              rules: [
                {
                  required: true,
                  message: "请选择!",
                },
              ],
            })(<Switch checkedChildren="是" unCheckedChildren="否" />)}
          </Form.Item>

          {getFieldValue("isRef") ? (
            <Fragment>
              <Form.Item label="选择模型">
                {getFieldDecorator("$ref", {
                  initialValue: field.$ref,
                  rules: [
                    {
                      required: true,
                      message: "请选择!",
                    },
                  ],
                })(
                  <Select placeholder="请选择" onChange={handleRefModelChange}>
                    {models.map(({ key, description }) => (
                      <Option
                        value={`#/definitions/${key}`}
                        key={key}
                        disabled={model.key === key}
                      >
                        <span>{`#/definitions/${key}`}</span>
                        <span
                          style={{
                            color: "#999",
                          }}
                        >{` (${description})`}</span>
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="模型字段">
                <Table
                  columns={[
                    {
                      title: "Type",
                      dataIndex: "type",
                    },
                    {
                      title: "Key",
                      dataIndex: "key",
                    },
                    {
                      title: "Description",
                      dataIndex: "description",
                    },
                    {
                      title: "Example",
                      dataIndex: "example",
                      render: text => (
                        <div
                          style={{
                            wordWrap: "break-word",
                            wordBreak: "break-all",
                          }}
                        >
                          {text}
                        </div>
                      ),
                    },
                  ]}
                  dataSource={refFields}
                  size="small"
                  pagination={false}
                  bordered
                />
              </Form.Item>
            </Fragment>
          ) : (
            <Fragment>
              <Form.Item label="键属性">
                <Form.Item
                  style={{
                    display: "inline-block",
                    marginRight: 12,
                    marginBottom: 0,
                  }}
                >
                  {getFieldDecorator("x-primaryKey", {
                    initialValue: field["x-primaryKey"],
                    valuePropName: "checked",
                  })(<Checkbox>主键</Checkbox>)}
                </Form.Item>

                <Form.Item style={{ display: "inline-block", marginBottom: 0 }}>
                  {getFieldDecorator("x-foreignKey", {
                    initialValue: field["x-foreignKey"],
                    valuePropName: "checked",
                  })(<Checkbox disabled>外键(暂不支持)</Checkbox>)}
                </Form.Item>
              </Form.Item>

              <Form.Item label="字段类型">
                {getFieldDecorator("type", {
                  initialValue: field.type,
                  rules: [
                    {
                      required: true,
                      message: "请选择!",
                    },
                  ],
                })(
                  <Select
                    placeholder="请选择"
                    showSearch
                    disabled={getFieldValue("isEnum")}
                    filterOption={(input, option) =>
                      option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={() => {
                      setFieldsValue({
                        format: undefined,
                      });
                    }}
                  >
                    {standDataTypes.map(item => (
                      <Option value={item} key={item}>
                        {item}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>

              <Form.Item label="字段格式">
                {getFieldDecorator("format", {
                  initialValue: field.format,
                  rules: [
                    {
                      required: true,
                      message: "请选择!",
                    },
                  ],
                })(
                  <Select
                    placeholder="请选择"
                    showSearch
                    disabled={getFieldValue("isEnum")}
                    filterOption={(input, option) =>
                      option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {Object.entries(dataTypes[getFieldValue("type")] || {}).map(
                      ([k, v]) => (
                        <Option value={k} key={k}>
                          <span>{k}</span>
                          <span
                            style={{
                              color: "#999",
                            }}
                          >{` (${v[0]}, ${v[1]})`}</span>
                        </Option>
                      )
                    )}
                  </Select>
                )}
              </Form.Item>

              <Form.Item
                label="是否枚举"
                required
                extra="仅当字段格式为[int4, string, char]时支持枚举"
              >
                {getFieldDecorator("isEnum", {
                  initialValue: field.isEnum,
                  valuePropName: "checked",
                })(
                  <Switch
                    checkedChildren="是"
                    unCheckedChildren="否"
                    disabled={
                      !["int4", "string", "char"].includes(
                        getFieldValue("format")
                      )
                    }
                  />
                )}
              </Form.Item>

              <Form.Item label="描述" hasFeedback>
                {getFieldValue("isEnum")
                  ? getFieldDecorator("x-description", {
                      initialValue: field["x-description"],
                      rules: [
                        {
                          required: true,
                          message: "请填写!",
                        },
                      ],
                    })(<Input placeholder="x-description" />)
                  : getFieldDecorator("description", {
                      initialValue: field.description,
                      rules: [
                        {
                          required: true,
                          message: "请填写!",
                        },
                      ],
                    })(<Input placeholder="description" />)}
              </Form.Item>

              <Form.Item label="标题" hasFeedback>
                {getFieldDecorator("title", {
                  initialValue: field.title,
                })(<Input placeholder="title" />)}
              </Form.Item>

              {getFieldValue("isEnum") && (
                <Form.Item label="枚举选项" required>
                  {getFieldDecorator("enumItems", {
                    initialValue: field.enumItems,
                    rules: [
                      {
                        validator: handleEnumItemsValidator,
                      },
                    ],
                  })(<EnumItems fieldType={getFieldValue("type")} />)}
                </Form.Item>
              )}

              {getFieldValue("format") === "object" && (
                <Fragment>
                  <Form.Item label="快速填充数据">
                    <Select
                      placeholder="请选择"
                      onChange={handleObjectModelChange}
                    >
                      {models.map(({ key, description }) => (
                        <Option
                          value={`#/definitions/${key}`}
                          key={key}
                          disabled={model.key === key}
                        >
                          <span>{`#/definitions/${key}`}</span>
                          <span
                            style={{
                              color: "#999",
                            }}
                          >{` (${description})`}</span>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item label="子字段选项">
                    {getFieldDecorator("subFields", {
                      initialValue: field.subFields,
                      rules: [
                        {
                          validator: handleSubFieldsValidator,
                        },
                      ],
                    })(<SubFields />)}
                  </Form.Item>
                </Fragment>
              )}

              {getFieldValue("format") === "array" && (
                <Fragment>
                  <Form.Item label="数组模型">
                    {getFieldDecorator("arrayRef", {
                      initialValue: field.arrayRef,
                      rules: [
                        {
                          required: true,
                          message: "请选择!",
                        },
                      ],
                    })(
                      <Select
                        placeholder="请选择"
                        onChange={handleArrayModelChange}
                      >
                        {models.map(({ key, description }) => (
                          <Option
                            value={`#/definitions/${key}`}
                            key={key}
                            disabled={model.key === key}
                          >
                            <span>{`#/definitions/${key}`}</span>
                            <span
                              style={{
                                color: "#999",
                              }}
                            >{` (${description})`}</span>
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item label="数组字段">
                    <Table
                      columns={[
                        {
                          title: "Type",
                          dataIndex: "type",
                        },
                        {
                          title: "Key",
                          dataIndex: "key",
                        },
                        {
                          title: "Description",
                          dataIndex: "description",
                        },
                        {
                          title: "Example",
                          dataIndex: "example",
                          render: text => (
                            <div
                              style={{
                                wordWrap: "break-word",
                                wordBreak: "break-all",
                              }}
                            >
                              {text}
                            </div>
                          ),
                        },
                      ]}
                      dataSource={arrayFields}
                      size="small"
                      pagination={false}
                      bordered
                    />
                  </Form.Item>
                </Fragment>
              )}

              {getFieldValue("type") === "string" && (
                <Fragment>
                  <Form.Item label="字符长度">
                    {getFieldDecorator("x-length", {
                      initialValue: field["x-length"],
                      rules: [
                        {
                          required: true,
                          message: "请填写!",
                        },
                      ],
                    })(
                      <InputNumber
                        min={1}
                        max={255}
                        parser={input => input && ~~input}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="长度范围">
                    <Form.Item
                      style={{ display: "inline-block", marginBottom: 0 }}
                    >
                      {getFieldDecorator(`minLength`, {
                        initialValue: field.minLength,
                      })(
                        <InputNumber
                          placeholder="MinLength"
                          min={1}
                          max={255}
                          parser={input => input && ~~input}
                        />
                      )}
                    </Form.Item>
                    <span
                      style={{
                        display: "inline-block",
                        width: "24px",
                        textAlign: "center",
                      }}
                    >
                      ~
                    </span>
                    <Form.Item
                      style={{ display: "inline-block", marginBottom: 0 }}
                    >
                      {getFieldDecorator(`maxLength`, {
                        initialValue: field.maxLength,
                      })(
                        <InputNumber
                          placeholder="MaxLength"
                          min={1}
                          max={255}
                          parser={input => input && ~~input}
                        />
                      )}
                    </Form.Item>
                  </Form.Item>
                </Fragment>
              )}

              {(getFieldValue("type") === "integer" ||
                getFieldValue("type") === "number") && (
                <Form.Item label="大小范围" style={{ marginBottom: 0 }}>
                  <Form.Item style={{ display: "inline-block" }}>
                    {getFieldDecorator(`minimum`, {
                      initialValue: field.minimum,
                    })(<InputNumber placeholder="Minimum" />)}
                  </Form.Item>
                  <span
                    style={{
                      display: "inline-block",
                      width: "24px",
                      textAlign: "center",
                    }}
                  >
                    ~
                  </span>
                  <Form.Item style={{ display: "inline-block" }}>
                    {getFieldDecorator(`maximum`, {
                      initialValue: field.maximum,
                    })(<InputNumber placeholder="Maximum" />)}
                  </Form.Item>
                </Form.Item>
              )}

              <Form.Item label="表单提示信息" hasFeedback>
                {getFieldDecorator("x-message", {
                  initialValue: field["x-message"],
                })(<Input placeholder="placeholder" />)}
              </Form.Item>

              {/* {(() => {
            if (data["x-isEnum"]) {
              return (
                <Fragment>
                  <Form.Item label="默认值">
                    <Select
                      name="default"
                      placeholder="请选择"
                      value={data.default}
                      onChange={value => {
                        if (value === null) {
                          handleKvDelete("default");
                        } else {
                          handleKvChange("default", value);
                        }
                      }}
                    >
                      <Option value={null}>
                        <span>Null</span>
                      </Option>
                      {Object.keys(data["x-enumMap"]).map(key => (
                        <Option value={~~key} key={key}>
                          <span>{key}</span>
                          <span
                            style={{
                              color: "#999",
                            }}
                          >{` (${data["x-enumMap"][key]})`}</span>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item label="示例值">
                    <Select
                      name="example"
                      placeholder="请选择"
                      value={data.example}
                      onChange={value => {
                        if (value === null) {
                          handleKvDelete("example");
                        } else {
                          handleKvChange("example", value);
                        }
                      }}
                    >
                      <Option value={null}>
                        <span>Null</span>
                      </Option>
                      {Object.keys(data["x-enumMap"]).map(key => (
                        <Option value={~~key} key={key}>
                          <span>{key}</span>
                          <span
                            style={{
                              color: "#999",
                            }}
                          >{` (${data["x-enumMap"][key]})`}</span>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Fragment>
              );
            } else if (numTypes.includes(getFieldValue("format"))) {
              return (
                <Fragment>
                  <Form.Item label="默认值">
                    <InputNumber
                      name="default"
                      placeholder="请输入"
                      value={data.default}
                      onChange={value => {
                        handleKvChange("default", value);
                      }}
                    />
                  </Form.Item>
                  <Form.Item label="示例值">
                    <InputNumber
                      name="example"
                      placeholder="请输入"
                      value={data.example}
                      onChange={value => {
                        handleKvChange("example", value);
                      }}
                    />
                  </Form.Item>
                </Fragment>
              );
            } else if (getFieldValue("format") === "date") {
              return (
                <Fragment>
                  <Form.Item label="默认值">
                    <DatePicker
                      name="default"
                      value={data.default ? moment(data.default) : null}
                      onChange={(_, dateString) => {
                        handleKvChange("default", dateString);
                      }}
                    />
                  </Form.Item>
                  <Form.Item label="示例值">
                    <DatePicker
                      name="example"
                      value={data.example ? moment(data.example) : null}
                      onChange={(_, dateString) => {
                        handleKvChange("example", dateString);
                      }}
                    />
                  </Form.Item>
                </Fragment>
              );
            } else if (getFieldValue("format") === "date-time") {
              return (
                <Fragment>
                  <Form.Item label="默认值">
                    <DatePicker
                      showTime
                      name="default"
                      value={data.default ? moment(data.default) : null}
                      onChange={(_, dateString) => {
                        handleKvChange("default", dateString);
                      }}
                    />
                  </Form.Item>
                  <Form.Item label="示例值">
                    <DatePicker
                      showTime
                      name="example"
                      value={data.example ? moment(data.example) : null}
                      onChange={(_, dateString) => {
                        handleKvChange("example", dateString);
                      }}
                    />
                  </Form.Item>
                </Fragment>
              );
            } else if (getFieldValue("format") === "text" || getFieldValue("format") === "json") {
              return (
                <Fragment>
                  <Form.Item label="默认值">
                    <TextArea
                      autosize
                      name="default"
                      placeholder="请输入"
                      value={data.default}
                      onChange={handleChange}
                    />
                  </Form.Item>
                  <Form.Item label="示例值">
                    <TextArea
                      autosize
                      name="example"
                      placeholder="请输入"
                      value={data.example}
                      onChange={handleChange}
                    />
                  </Form.Item>
                </Fragment>
              );
            } else if (getFieldValue("format") === "boolean") {
              return (
                <Fragment>
                  <Form.Item label="默认值">
                    <Checkbox
                      checked={data.default === true}
                      onChange={e => {
                        if (e.target.checked) {
                          handleKvChange("default", true);
                        } else {
                          handleKvDelete("default");
                        }
                      }}
                    >
                      True
                    </Checkbox>
                    <Checkbox
                      checked={data.default === false}
                      onChange={e => {
                        if (e.target.checked) {
                          handleKvChange("default", false);
                        } else {
                          handleKvDelete("default");
                        }
                      }}
                    >
                      False
                    </Checkbox>
                  </Form.Item>
                  <Form.Item label="示例值">
                    <Checkbox
                      checked={data.example === true}
                      onChange={e => {
                        if (e.target.checked) {
                          handleKvChange("example", true);
                        } else {
                          handleKvDelete("example");
                        }
                      }}
                    >
                      True
                    </Checkbox>
                    <Checkbox
                      checked={data.example === false}
                      onChange={e => {
                        if (e.target.checked) {
                          handleKvChange("example", false);
                        } else {
                          handleKvDelete("example");
                        }
                      }}
                    >
                      False
                    </Checkbox>
                  </Form.Item>
                </Fragment>
              );
            } else if (getFieldValue("format") !== "object" && getFieldValue("format") !== "array") {
              return (
                <Fragment>
                  <Form.Item label="默认值">
                    <Input
                      name="default"
                      placeholder="请输入"
                      value={data.default}
                      onChange={handleChange}
                    />
                  </Form.Item>
                  <Form.Item label="示例值">
                    <Input
                      name="example"
                      placeholder="请输入"
                      value={data.example}
                      onChange={handleChange}
                    />
                  </Form.Item>
                </Fragment>
              );
            }
          })()} */}

              <Form.Item label="其他选项" style={{ marginBottom: 0 }}>
                <Form.Item style={{ display: "inline-block", marginRight: 12 }}>
                  {getFieldDecorator("uniqueItems", {
                    initialValue: field.uniqueItems,
                    valuePropName: "checked",
                  })(<Checkbox>值唯一</Checkbox>)}
                </Form.Item>
                <Form.Item style={{ display: "inline-block" }}>
                  {getFieldDecorator("x-isExample", {
                    initialValue: field["x-isExample"],
                    valuePropName: "checked",
                  })(<Checkbox>作为示例</Checkbox>)}
                </Form.Item>
              </Form.Item>

              <Form.Item label="表单选项" style={{ marginBottom: 0 }}>
                <Form.Item style={{ display: "inline-block", marginRight: 12 }}>
                  {getFieldDecorator("x-showTable", {
                    initialValue: field["x-showTable"],
                    valuePropName: "checked",
                  })(<Checkbox>列表显示</Checkbox>)}
                </Form.Item>
                <Form.Item style={{ display: "inline-block", marginRight: 12 }}>
                  {getFieldDecorator("x-showFilter", {
                    initialValue: field["x-showFilter"],
                    valuePropName: "checked",
                  })(<Checkbox>可过滤</Checkbox>)}
                </Form.Item>
                <Form.Item style={{ display: "inline-block", marginRight: 12 }}>
                  {getFieldDecorator("x-showSorter", {
                    initialValue: field["x-showSorter"],
                    valuePropName: "checked",
                  })(<Checkbox>可排序</Checkbox>)}
                </Form.Item>
                <Form.Item style={{ display: "inline-block" }}>
                  {getFieldValue("format") === "text" &&
                    getFieldDecorator("x-isRichText", {
                      initialValue: field["x-isRichText"],
                      valuePropName: "checked",
                    })(<Checkbox>使用富文本编辑器</Checkbox>)}
                </Form.Item>
              </Form.Item>
            </Fragment>
          )}
        </Form>
        <div
          style={{
            borderTop: "1px solid #e9e9e9",
            padding: "10px 16px",
            background: "#fff",
            textAlign: "right",
          }}
        >
          <Button onClick={handleHide} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button onClick={handleReset} style={{ marginRight: 8 }}>
            Reset
          </Button>
          <Button onClick={handleSubmit} type="primary">
            Submit
          </Button>
        </div>
      </Drawer>
    </span>
  );
}

export default Form.create({ name: "fieldEdit" })(FieldEdit);
