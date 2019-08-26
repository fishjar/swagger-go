import React, { Fragment, useState, useEffect, forwardRef } from "react";
import moment from "moment";
import {
  formItemLayout,
  dataFormats,
  dataTypes,
  numTypes,
  standDataTypes,
} from "../../config";
import {
  getModelProps,
  parseRef,
  hasDuplication,
  parseArrayToObject,
  filterObjectItems,
  filterArrayItems2,
} from "../../utils";
import SubFields from "./subFields";
import EnumItems from "./enumItems";
import DateSelect from "./dateSelect";
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
import { setTimeout } from "timers";
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
  field = {
    isRef: false,
  },
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
  const [refFields, setRefFields] = useState(field.refFields || []);
  // const [arrayRef, setArrayRef] = useState(field.arrayRef);
  // const [arrayModel, setArrayModel] = useState(field.arrayModel);
  const [arrayFields, setArrayFields] = useState(field.arrayFields || []);
  // const [subFields, setSubFields] = useState(field.subFields);
  // const [enumItems, setEnumItems] = useState(field.enumItems || []);

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
        return;
      }
      console.log(values);
      const {
        key,
        isRef,
        isEnum,
        isRequired,
        isExample,
        enumItems = [],
        subFields,
        arrayType,
        arrayRef,
        ...data
      } = values;

      filterObjectItems(data);

      if (data.type === "object") {
        data.properties = parseArrayToObject(subFields);
      } else if (data.type === "array") {
        if (arrayType === "object") {
          data.items = { $ref: arrayRef };
        } else {
          data.items = { type: arrayType };
        }
      }

      if (isEnum) {
        data.enum = [];
        data["x-enumMap"] = {};
        data.description = `"${data["x-description"]}"`;
        enumItems.forEach(item => {
          data.enum.push(item.key);
          data["x-enumMap"][item.key] = item.description;
          data.description += `\n  * ${item.key} - ${item.description}`;
        });
      }
      console.log(key);
      console.log(data);

      const { key: modelKey, ...modelData } = model;
      const { properties = {}, required = [], example = {} } = modelData;
      if (isRequired) {
        if (!required.includes(key)) {
          required.push(key);
        }
      } else {
        filterArrayItems2(required, key);
      }
      if (isExample) {
        if (data.example !== undefined) {
          example[key] = data.example;
        }
      } else {
        delete example[key];
      }

      console.log(required);
      console.log(example);

      dispatch({
        type: "MODEL_UPDATE",
        payload: {
          [modelKey]: {
            ...modelData,
            required,
            example,
            properties: {
              ...properties,
              [key]: data,
            },
          },
        },
      });
      setVisible(false);
    });
  }

  /**
   * 切换外链模型
   * @param {Boolean} value
   */
  function handleRefSwitch(value) {
    if (value === field.isRef) {
      // handleReset();
      setTimeout(() => {
        handleReset();
      }, 100);
    }
  }

  /**
   * 字段名称校验
   * @param {*} rule
   * @param {*} value
   * @param {*} callback
   */
  function handleFieldKeyValidator(rule, value, callback) {
    if (fields.map(item => item.key).includes(value) && formMode === "create") {
      callback("字段名称重复");
    }
    callback();
  }

  /**
   * 字段名称校验
   * @param {*} rule
   * @param {*} value
   * @param {*} callback
   */
  function handleFieldNameValidator(rule, value, callback) {
    if (formMode === "create") {
      if (fields.map(item => item["x-fieldName"]).includes(value)) {
        callback("数据库字段名称重复");
      }
      if (fields.map(item => item.key).includes(value)) {
        callback("字段名称重复");
      }
    }
    if (formMode === "edit") {
      if (
        fields
          .filter(item => item.key !== field.key)
          .map(item => item["x-fieldName"])
          .includes(value)
      ) {
        callback("数据库字段名称重复");
      }
      if (
        fields
          .filter(item => item.key !== field.key)
          .map(item => item.key)
          .includes(value)
      ) {
        callback("字段名称重复");
      }
    }
    callback();
  }

  /**
   * 子字段校验
   * @param {*} rule
   * @param {*} value
   * @param {*} callback
   */
  function handleSubFieldsValidator(rule, value, callback) {
    const validValue = value.filter(
      item => item.key && item.type && item.description
    );
    if (validValue.length < 1) {
      callback("有效子字段不能少于一项");
    }
    if (hasDuplication(validValue)) {
      callback("子字段名称重复");
    }
    callback();
  }

  function handleTypeChange(value) {
    // setFieldsValue({
    //   format: undefined,
    // });
    switch (value) {
      case "integer":
        setFieldsValue({
          format: "int32",
        });
        break;
      case "number":
        setFieldsValue({
          format: "float",
        });
        break;
      case "string":
        setFieldsValue({
          format: "string",
        });
        break;
      case "object":
        setFieldsValue({
          format: "object",
        });
        break;
      case "array":
        setFieldsValue({
          format: "array",
        });
        break;
      case "boolean":
        setFieldsValue({
          format: "boolean",
        });
        break;
      default:
    }
  }

  /**
   * 枚举项目校验
   * @param {*} rule
   * @param {*} value
   * @param {Function} callback
   */
  function handleEnumItemsValidator(rule, value, callback) {
    const validValue = value.filter(item => item.key && item.description);
    if (validValue.length < 2) {
      callback("有效子字段不能少于两项");
    }
    if (hasDuplication(validValue)) {
      callback("子字段名称重复");
    }
    callback();
  }

  /**
   * 选择时快速插入数据时
   * 获取模型字段
   * @param {String} ref
   */
  function handleObjectModelChange(ref) {
    const [_, subFields] = parseRef(models, ref);
    setFieldsValue({ subFields });
  }

  /**
   * 选择外链模型时
   * 获取模型字段
   * @param {String} ref
   */
  function handleRefModelChange(ref) {
    const [_, newRefFields] = parseRef(models, ref);
    setRefFields(newRefFields);
  }

  /**
   * 数组类型时选择数据模型时
   * 获取模型字段
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
            })(<Input placeholder="fieldKey" disabled={formMode === "edit"} />)}
          </Form.Item>

          <Form.Item label="数据库字段名" hasFeedback>
            {getFieldDecorator("x-fieldName", {
              initialValue: field["x-fieldName"] || field.key,
              rules: [
                {
                  required: true,
                  message: "请填写!",
                },
                {
                  validator: handleFieldNameValidator,
                },
              ],
            })(<Input placeholder="field_name" />)}
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
            })(
              <Switch
                checkedChildren="是"
                unCheckedChildren="否"
                onChange={handleRefSwitch}
              />
            )}
          </Form.Item>

          {getFieldValue("isRef") ? (
            <Fragment>
              <Form.Item label="描述" hasFeedback>
                {getFieldDecorator("x-description", {
                  initialValue: field["x-description"],
                  rules: [
                    {
                      required: true,
                      message: "请填写!",
                    },
                  ],
                })(<Input placeholder="x-description" />)}
              </Form.Item>
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
              <Form.Item label="其他选项">
                {getFieldDecorator("isRequired", {
                  initialValue: field.isRequired,
                  valuePropName: "checked",
                })(<Checkbox>不能为空</Checkbox>)}
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
                    onChange={handleTypeChange}
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
                extra="仅当字段格式为[int4, int32, string, char]时支持枚举"
              >
                {getFieldDecorator("isEnum", {
                  initialValue: field.isEnum,
                  valuePropName: "checked",
                })(
                  <Switch
                    checkedChildren="是"
                    unCheckedChildren="否"
                    disabled={
                      !["int4", "int32", "string", "char"].includes(
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

              {getFieldValue("type") === "object" && (
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

              {getFieldValue("type") === "array" && (
                <Fragment>
                  <Form.Item label="数组类型">
                    {getFieldDecorator("arrayType", {
                      initialValue: field.arrayType,
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
                        filterOption={(input, option) =>
                          option.key
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {standDataTypes.map(item => (
                          <Option value={item} key={item}>
                            {item}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                  {getFieldValue("arrayType") === "object" && (
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
                </Fragment>
              )}

              {getFieldValue("type") === "string" && (
                <Fragment>
                  <Form.Item label="字符长度">
                    {getFieldDecorator("x-length", {
                      initialValue: field["x-length"],
                    })(
                      <InputNumber
                        placeholder="Length"
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

              {(() => {
                if (getFieldValue("isEnum")) {
                  return (
                    <Fragment>
                      <Form.Item label="默认值">
                        {getFieldDecorator("default", {
                          initialValue: field.default,
                        })(
                          <Select placeholder="请选择" allowClear>
                            {(getFieldValue("enumItems") || []).map(
                              ({ key, description }, index) => (
                                <Option value={key} key={key || index}>
                                  <span>{key}</span>
                                  <span
                                    style={{
                                      color: "#999",
                                    }}
                                  >{` (${description})`}</span>
                                </Option>
                              )
                            )}
                          </Select>
                        )}
                      </Form.Item>
                      <Form.Item label="示例值">
                        {getFieldDecorator("example", {
                          initialValue: field.example,
                        })(
                          <Select placeholder="请选择" allowClear>
                            {(getFieldValue("enumItems") || []).map(
                              ({ key, description }, index) => (
                                <Option value={key} key={key || index}>
                                  <span>{key}</span>
                                  <span
                                    style={{
                                      color: "#999",
                                    }}
                                  >{` (${description})`}</span>
                                </Option>
                              )
                            )}
                          </Select>
                        )}
                      </Form.Item>
                    </Fragment>
                  );
                } else if (getFieldValue("type") === "integer") {
                  return (
                    <Fragment>
                      <Form.Item label="默认值">
                        {getFieldDecorator(`default`, {
                          initialValue: field.default,
                        })(
                          <InputNumber
                            placeholder="Default"
                            parser={input => input && ~~input}
                          />
                        )}
                      </Form.Item>
                      <Form.Item label="示例值">
                        {getFieldDecorator(`example`, {
                          initialValue: field.example,
                        })(
                          <InputNumber
                            placeholder="Example"
                            parser={input => input && ~~input}
                          />
                        )}
                      </Form.Item>
                    </Fragment>
                  );
                } else if (getFieldValue("type") === "number") {
                  return (
                    <Fragment>
                      <Form.Item label="默认值">
                        {getFieldDecorator(`default`, {
                          initialValue: field.default,
                        })(<InputNumber placeholder="Default" />)}
                      </Form.Item>
                      <Form.Item label="示例值">
                        {getFieldDecorator(`example`, {
                          initialValue: field.example,
                        })(<InputNumber placeholder="Example" />)}
                      </Form.Item>
                    </Fragment>
                  );
                } else if (getFieldValue("type") === "boolean") {
                  return (
                    <Fragment>
                      <Form.Item label="默认值">
                        {getFieldDecorator(`default`, {
                          initialValue: field.default,
                        })(
                          <Radio.Group>
                            <Radio value={undefined}>Null</Radio>
                            <Radio value={true}>True</Radio>
                            <Radio value={false}>False</Radio>
                          </Radio.Group>
                        )}
                      </Form.Item>
                      <Form.Item label="示例值">
                        {getFieldDecorator(`example`, {
                          initialValue: field.example,
                        })(
                          <Radio.Group>
                            <Radio value={undefined}>Null</Radio>
                            <Radio value={true}>True</Radio>
                            <Radio value={false}>False</Radio>
                          </Radio.Group>
                        )}
                      </Form.Item>
                    </Fragment>
                  );
                } else if (
                  getFieldValue("format") === "date" ||
                  getFieldValue("format") === "date-time"
                ) {
                  return (
                    <Fragment>
                      <Form.Item label="默认值">
                        {getFieldDecorator(`default`, {
                          initialValue: field.default,
                        })(
                          <DateSelect
                            showTime={getFieldValue("format") === "date-time"}
                          />
                        )}
                      </Form.Item>
                      <Form.Item label="示例值">
                        {getFieldDecorator(`example`, {
                          initialValue: field.example,
                        })(
                          <DateSelect
                            showTime={getFieldValue("format") === "date-time"}
                          />
                        )}
                      </Form.Item>
                    </Fragment>
                  );
                } else if (
                  getFieldValue("format") === "text" ||
                  getFieldValue("format") === "json"
                ) {
                  return (
                    <Fragment>
                      <Form.Item label="默认值">
                        {getFieldDecorator(`default`, {
                          initialValue: field.default,
                        })(<TextArea placeholder="Default" autosize />)}
                      </Form.Item>
                      <Form.Item label="示例值">
                        {getFieldDecorator(`example`, {
                          initialValue: field.example,
                        })(<TextArea placeholder="Example" autosize />)}
                      </Form.Item>
                    </Fragment>
                  );
                } else if (
                  getFieldValue("type") !== "object" &&
                  getFieldValue("type") !== "array"
                ) {
                  return (
                    <Fragment>
                      <Form.Item label="默认值" hasFeedback>
                        {getFieldDecorator(`default`, {
                          initialValue: field.default,
                        })(<Input placeholder="Default" />)}
                      </Form.Item>
                      <Form.Item label="示例值" hasFeedback>
                        {getFieldDecorator(`example`, {
                          initialValue: field.example,
                        })(<Input placeholder="Example" />)}
                      </Form.Item>
                    </Fragment>
                  );
                }
              })()}

              <Form.Item label="其他选项" style={{ marginBottom: 0 }}>
                <Form.Item style={{ display: "inline-block", marginRight: 12 }}>
                  {getFieldDecorator("isRequired", {
                    initialValue: field.isRequired,
                    valuePropName: "checked",
                  })(<Checkbox>不能为空</Checkbox>)}
                </Form.Item>
                <Form.Item style={{ display: "inline-block", marginRight: 12 }}>
                  {getFieldDecorator("uniqueItems", {
                    initialValue: field.uniqueItems,
                    valuePropName: "checked",
                  })(<Checkbox>值唯一</Checkbox>)}
                </Form.Item>
                <Form.Item style={{ display: "inline-block" }}>
                  {getFieldDecorator("isExample", {
                    initialValue: field.isExample,
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
