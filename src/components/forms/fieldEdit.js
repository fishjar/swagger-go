import React, { Fragment, useState, useEffect, forwardRef } from "react";
import moment from "moment";
import { formItemLayout, dataFormats, numTypes, propTypes } from "../../config";
import { getModelProps } from "../../utils";
import SubFields from "./subFields";
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
        key: numTypes.includes(field.format) ? ~~k : k,
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
    const ref = field.items && field.items["$ref"];
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
    setObjectSource("custom");
    setArrayItems([...defaultArrayItems]);
    resetFields();
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
    if (value.length === 0) {
      callback("子字段不能少于一项");
    }
    const validValue = value.filter(item => item.key);
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
            })(<Input disabled={formMode === "edit"} />)}
          </Form.Item>

          <Form.Item label="字段类型">
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
                showSearch
                disabled={field["x-isEnum"]}
                filterOption={(input, option) =>
                  option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {Object.entries(dataFormats).map(([k, v]) => (
                  <Option value={k} key={k}>
                    <span>{k}</span>
                    <span
                      style={{
                        color: "#999",
                      }}
                    >{` (${v[0]}, ${v[1]}, ${v[2]})`}</span>
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>

          <Form.Item label="是否枚举" required>
            {getFieldDecorator("x-isEnum", {
              initialValue: field["x-isEnum"],
              valuePropName: "checked",
            })(
              <Switch
                checkedChildren="是"
                unCheckedChildren="否"
                disabled={!["int4", "string", "char"].includes(field.format)}
              />
            )}
          </Form.Item>

          <Form.Item label="描述">
            {field["x-isEnum"]
              ? getFieldDecorator("x-description", {
                  initialValue: field["x-description"],
                  rules: [
                    {
                      required: true,
                      message: "请填写!",
                    },
                  ],
                })(<Input />)
              : getFieldDecorator("description", {
                  initialValue: field.description,
                  rules: [
                    {
                      required: true,
                      message: "请填写!",
                    },
                  ],
                })(<Input />)}
          </Form.Item>

          {field["x-isEnum"] && (
            <Form.Item label="枚举选项">
              {enumItems.map((item, index) => (
                <div
                  key={index}
                  style={{
                    position: "relative",
                  }}
                >
                  <InputGroup compact>
                    {getFieldDecorator(`enumItems[${index}].key`, {
                      initialValue: item.key,
                      rules: [
                        {
                          required: true,
                          message: "请填写!",
                        },
                      ],
                    })(
                      numTypes.includes(field.format) ? (
                        <InputNumber
                          // parser={input => ~~input}
                          style={{ width: "40%" }}
                          placeholder="Key"
                        />
                      ) : (
                        <Input style={{ width: "40%" }} placeholder="Key" />
                      )
                    )}
                    {getFieldDecorator(`enumItems[${index}].description`, {
                      initialValue: item.description,
                      rules: [
                        {
                          required: true,
                          message: "请填写!",
                        },
                      ],
                    })(<Input style={{ width: "60%" }} placeholder="Value" />)}
                  </InputGroup>
                  <Icon
                    style={{
                      position: "absolute",
                      right: -20,
                      top: 12,
                    }}
                    type="minus-circle-o"
                    onClick={e => {
                      // handleEnumRemove(index);
                      console.log(index);
                    }}
                  />
                </div>
              ))}
              <Button
                style={{
                  width: "100%",
                  marginTop: 12,
                }}
                type="dashed"
                onClick={() => {}}
                icon="plus"
              >
                Add field
              </Button>
              <TextArea
                autosize
                disabled
                value={field.description}
                style={{
                  marginTop: 12,
                }}
              />
            </Form.Item>
          )}

          {field.format === "object" && (
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

          {field.format === "object" && objectSource === "models" && (
            <Form.Item label="数据模型">
              <Select placeholder="请选择" onChange={handleObjectModelChange}>
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

          {field.format === "array" && (
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

          {field.format === "object" && (
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

          {field.format === "array" && (
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

          {(field.format === "string" || field.format === "char") && (
            <Form.Item label="数据长度">
              {getFieldDecorator("x-length", {
                initialValue: field["x-length"],
              })(
                <InputNumber
                  min={0}
                  max={255}
                  // parser={input => ~~input}
                />
              )}
            </Form.Item>
          )}

          {/* {field.format === "string" && (
            <Form.Item label="长度范围" style={{ marginBottom: 0 }}>
              <Form.Item style={{ display: "inline-block" }}>
                {getFieldDecorator(`minLength`, {
                  initialValue: field.minLength,
                })(<InputNumber placeholder="MinLength" min={0} max={255} />)}
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
                {getFieldDecorator(`maxLength`, {
                  initialValue: field.maxLength,
                })(<InputNumber placeholder="MaxLength" min={0} max={255} />)}
              </Form.Item>
            </Form.Item>
          )} */}

          {/* {numTypes.includes(field.format) && (
            <Form.Item label="大小范围">
              <InputGroup compact>
                {getFieldDecorator(`minimum`, {
                  initialValue: field.minimum,
                })(
                  <InputNumber
                    style={{ width: 100, textAlign: "center" }}
                    placeholder="Minimum"
                    min={0}
                    max={255}
                  />
                )}

                <Input
                  style={{
                    width: 30,
                    borderLeft: 0,
                    pointerEvents: "none",
                    backgroundColor: "#fff",
                  }}
                  placeholder="~"
                  disabled
                />
                {getFieldDecorator(`maximum`, {
                  initialValue: field.maximum,
                })(
                  <InputNumber
                    style={{ width: 100, textAlign: "center", borderLeft: 0 }}
                    placeholder="Maximum"
                    min={0}
                    max={255}
                  />
                )}
              </InputGroup>
            </Form.Item>
          )} */}

          <Form.Item label="提示信息" hasFeedback>
            {getFieldDecorator("x-message", {
              initialValue: field["x-message"],
            })(<Input />)}
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
            } else if (numTypes.includes(data.format)) {
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
            } else if (data.format === "date") {
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
            } else if (data.format === "date-time") {
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
            } else if (data.format === "text" || data.format === "json") {
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
            } else if (data.format === "boolean") {
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
            } else if (data.format !== "object" && data.format !== "array") {
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

          {/* <Form.Item label="其他选项" style={{ marginBottom: 0 }}>
            <Form.Item style={{ display: "inline-block", marginRight: 12 }}>
              {getFieldDecorator("uniqueItems", {
                initialValue: field.uniqueItems,
                valuePropName: "checked",
              })(<Checkbox>Unique</Checkbox>)}
            </Form.Item>
            <Form.Item style={{ display: "inline-block" }}>
              {getFieldDecorator("x-isExample", {
                initialValue: field["x-isExample"],
                valuePropName: "checked",
              })(<Checkbox>InExample</Checkbox>)}
            </Form.Item>
          </Form.Item>

          <Form.Item label="表单选项" style={{ marginBottom: 0 }}>
            <Form.Item style={{ display: "inline-block", marginRight: 12 }}>
              {getFieldDecorator("x-showTable", {
                initialValue: field["x-showTable"],
                valuePropName: "checked",
              })(<Checkbox>showInTable</Checkbox>)}
            </Form.Item>
            <Form.Item style={{ display: "inline-block", marginRight: 12 }}>
              {getFieldDecorator("x-showFilter", {
                initialValue: field["x-showFilter"],
                valuePropName: "checked",
              })(<Checkbox>showFilter</Checkbox>)}
            </Form.Item>
            <Form.Item style={{ display: "inline-block", marginRight: 12 }}>
              {getFieldDecorator("x-showSorter", {
                initialValue: field["x-showSorter"],
                valuePropName: "checked",
              })(<Checkbox>showSorter</Checkbox>)}
            </Form.Item>
            <Form.Item style={{ display: "inline-block" }}>
              {field.format === "text" &&
                getFieldDecorator("x-isRichText", {
                  initialValue: field["x-isRichText"],
                  valuePropName: "checked",
                })(<Checkbox>useRichText</Checkbox>)}
            </Form.Item>
          </Form.Item> */}

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
