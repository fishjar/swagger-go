import React, { Fragment, useState, useEffect, forwardRef } from "react";
import moment from "moment";
import {
  formItemLayout,
  dataFormats,
  dataTypes,
  numTypes,
  standDataTypes,
} from "../../config";
import { getModelProps } from "../../utils";
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
   * 计算值
   * 仅在字段类型为object时有用
   * 获取本字段的子字段，并将对象转为一个对象列表
   */
  const subFields = getModelProps(field);

  /**
   * 计算值
   * 根据默认数据的枚举对象或枚举数组，计算得到一个枚举对象列表
   */
  const enumItems = (() => {
    if (!field["x-isEnum"]) {
      return [];
    }
    if (field["x-enumMap"]) {
      return Object.entries(field["x-enumMap"]).map(([k, v]) => ({
        key: field.type === "integer" ? ~~k : k,
        description: v,
      }));
    }
    return field.enum.map(k => ({
      key: k,
      description: "",
    }));
  })();

  /**
   * 计算值
   * 仅在字段类型为array时有用
   * 获取array item链接到的模型，并将其字段转为一个对象列表
   */
  const defaultArrayItems = (() => {
    const ref = field.items && field.items.$ref;
    if (!ref) {
      return [];
    }
    if (models.length === 0) {
      return [];
    }
    return getModelProps(
      models.find(item => item.key === ref.replace("#/definitions/", ""))
    );
  })();

  /**
   * 设置state hooks
   */
  const [visible, setVisible] = useState(false); // 抽屉是否可见
  const [objectSource, setObjectSource] = useState("custom");
  const [arrayItems, setArrayItems] = useState([...defaultArrayItems]);
  const [outObject, setOutObject] = useState(!!field.$ref);

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
    setArrayItems([...defaultArrayItems]);
    setObjectSource("custom");
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
    if (
      validValue.length !==
      [...new Set(validValue.map(item => item.key))].length
    ) {
      callback("子字段名称重复");
    }
    callback();
  }

  function handleEnumItemsValidator(rule, value, callback) {
    const validValue = value.filter(item => item.key);
    if (validValue.length < 2) {
      callback("有效子字段不能少于两项");
    }
    if (
      validValue.length !==
      [...new Set(validValue.map(item => item.key))].length
    ) {
      callback("子字段名称重复");
    }
    callback();
  }

  function handleObjectModelChange(value) {
    const modelKey = value.replace("#/definitions/", "");
    setFieldsValue({
      subFields: getModelProps(models.find(item => item.key === modelKey)),
    });
  }

  /**
   * 选择数组类型的数据模型
   * @param {String} value
   */
  function handleArrayModelChange(value) {
    const modelKey = value.replace("#/definitions/", "");
    setArrayItems(getModelProps(models.find(item => item.key === modelKey)));
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
            <Switch
              checked={outObject}
              checkedChildren="是"
              unCheckedChildren="否"
              onChange={checked => {
                setOutObject(checked);
                setFieldsValue({
                  $ref: undefined,
                });
              }}
            />
          </Form.Item>

          {outObject ? (
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
                <Select placeholder="请选择">
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
                    disabled={getFieldValue("x-isEnum")}
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
                    disabled={getFieldValue("x-isEnum")}
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
                extra="仅当字段类型为[int4, string, char]时支持枚举"
              >
                {getFieldDecorator("x-isEnum", {
                  initialValue: field["x-isEnum"],
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
                {getFieldValue("x-isEnum")
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

              {getFieldValue("x-isEnum") && (
                <Form.Item label="枚举选项" required>
                  {getFieldDecorator("enumItems", {
                    initialValue: enumItems,
                    rules: [
                      {
                        validator: handleEnumItemsValidator,
                      },
                    ],
                  })(<EnumItems fieldType={getFieldValue("type")} />)}
                </Form.Item>
              )}

              {getFieldValue("format") === "object" && (
                <Form.Item label="数据来源">
                  <Radio.Group
                    onChange={e => {
                      setObjectSource(e.target.value);
                      if (e.target.value === "custom") {
                        // handleKvDelete("x-ref");
                      }
                    }}
                    value={objectSource}
                  >
                    <Radio value={"custom"}>Custom</Radio>
                    <Radio value={"models"}>Models</Radio>
                  </Radio.Group>
                </Form.Item>
              )}

              {getFieldValue("format") === "object" &&
                objectSource === "models" && (
                  <Form.Item label="数据模型">
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
                )}

              {getFieldValue("format") === "array" && (
                <Form.Item label="数据模型">
                  <Select
                    placeholder="请选择"
                    value={field.items && field.items.$ref}
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
                </Form.Item>
              )}

              {getFieldValue("format") === "object" && (
                <Form.Item label="子字段选项">
                  {getFieldDecorator("subFields", {
                    initialValue: subFields,
                    rules: [
                      {
                        validator: handleSubFieldsValidator,
                      },
                    ],
                  })(<SubFields objectSource={objectSource} />)}
                </Form.Item>
              )}

              {getFieldValue("format") === "array" && (
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
                    dataSource={arrayItems}
                    size="small"
                    pagination={false}
                    bordered
                  />
                </Form.Item>
              )}

              {(getFieldValue("format") === "string" ||
                getFieldValue("format") === "char") && (
                <Form.Item label="数据长度">
                  {getFieldDecorator("x-length", {
                    initialValue: field["x-length"] || 255,
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
              )}

              {getFieldValue("format") === "string" && (
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
