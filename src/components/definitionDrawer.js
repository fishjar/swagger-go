import React, { Fragment, useState, useEffect } from "react";
import moment from "moment";
import { formItemLayout, dataFormats, numTypes, propTypes } from "../config";
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
} from "antd";
const { Panel } = Collapse;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;
const InputGroup = Input.Group;
const { TextArea } = Input;

/**
 * 工具函数
 * 获取一个对象的简单属性列表
 * @param {Object} o
 */
const getModelProps = o => {
  if (!o || !o.properties) {
    return [];
  }
  return Object.keys(o.properties).map(key => ({
    key,
    type: o.properties[key].type,
    description: o.properties[key].description,
    example:
      o.properties[key].example ||
      (o.example && o.example[key] && o.example[key].toString()),
  }));
};

export default function DefinitionDrawer({
  children,
  title = "编辑",
  formMode,
  dispatch,
  models,
  model,
  fields,
  field: defaultData,
}) {
  /**
   * 计算值
   * 仅在字段类型为object时有用
   * 获取本字段的子字段，并将对象转为一个对象列表
   */
  const defaultSubFields = getModelProps(defaultData);

  /**
   * 计算值
   * 根据默认数据的枚举对象或枚举数组，计算得到一个枚举对象列表
   */
  const defaultEnumItems = (() => {
    if (!defaultData["x-isEnum"]) {
      return [];
    }
    if (defaultData["x-enumMap"]) {
      return Object.keys(defaultData["x-enumMap"]).map(value => ({
        value: ~~value,
        description: defaultData["x-enumMap"][value],
      }));
    }
    return defaultData.enum.map(value => ({
      value,
      description: "",
    }));
  })();

  /**
   * 计算值
   * 仅在字段类型为array时有用
   * 获取array item链接到的模型，并将其字段转为一个对象列表
   */
  const defaultArrayItems = (() => {
    const ref = defaultData.items && defaultData.items["$ref"];
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
  const [data, setData] = useState({ ...defaultData }); // 表单数据
  const [enumSource, setEnumSource] = useState("custom"); // 枚举数据来源： custom 或 models
  const [enumItems, setEnumItems] = useState([...defaultEnumItems]); // 枚举列表
  const [subFields, setSubFields] = useState([...defaultSubFields]); //子字段列表
  const [arrayItems, setArrayItems] = useState([...defaultArrayItems]); // 数组对象列表

  // useEffect(() => {
  //   setData({
  //     ...data,
  //     "x-length": defaultData["x-length"] || 255,
  //   });
  // }, [data.format]);

  /**
   * 副作用
   * 根据最新的枚举列表更新数据
   */
  useEffect(() => {
    if (data["x-isEnum"]) {
      const newEnum = [];
      const newEnumMap = {};
      let newDescription = `"${data["x-description"]}"`;

      enumItems
        .filter(item => item.value)
        .forEach(({ value, description }) => {
          newEnum.push(value);
          newEnumMap[value] = description;
          newDescription += `\n  * ${value} - ${description || ""}`;
        });

      setData({
        ...data,
        enum: [...new Set(newEnum)],
        description: newDescription,
        "x-enumMap": newEnumMap,
        default: newEnum.includes(data.default) ? data.default : newEnum[0],
        example: newEnum.includes(data.example) ? data.example : newEnum[0],
      });
    } else {
      const newData = { ...data };
      delete newData.enum;
      setData(newData);
    }
  }, [enumItems, data["x-isEnum"]]);

  /**
   * 副作用
   * 根据子字段列表更新数据
   */
  useEffect(() => {
    const properties = {};
    subFields
      .filter(item => item.key && item.type)
      .forEach(item => {
        properties[item.key] = {
          type: item.type,
          description: item.description,
          example: item.example,
        };
      });

    setData({
      ...data,
      properties,
    });
  }, [subFields]);

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
   * 常规表单更新
   * @param {Event} e
   */
  function handleChange(e) {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  }

  /**
   * 根据key，value更新数据
   * @param {*} key
   * @param {*} value
   */
  function handleKvChange(key, value) {
    setData({
      ...data,
      [key]: value,
    });
  }

  /**
   * 根据key删除字段
   * @param {String} key
   */
  function handleKvDelete(key) {
    const newData = { ...data };
    delete newData[key];
    setData(newData);
  }

  /**
   * 常规选择更新
   * @param {Event} e
   */
  function handleCheck(e) {
    const { name, checked } = e.target;
    setData({
      ...data,
      [name]: checked,
    });
  }

  /**
   * 字段类型改变
   * @param {String} value
   */
  function handleFormatChange(value) {
    setData({
      ...data,
      format: value,
      type: dataFormats[value][0],
    });
  }

  // /**
  //  * 枚举开关
  //  * @param {Event} e
  //  */
  // function handleEnumToggle(e) {
  //   const { checked } = e.target;
  //   setData({
  //     ...data,
  //     ["x-isEnum"]: checked,
  //   });
  // }

  /**
   * 添加枚举
   */
  function handleEnumAdd() {
    setEnumItems([...enumItems, {}]);
  }

  /**
   * 删除枚举
   * @param {Number} index
   */
  function handleEnumRemove(index) {
    const newEnumItems = [...enumItems];
    newEnumItems.splice(index, 1);
    setEnumItems(newEnumItems);
  }

  /**
   * 修改枚举
   * @param {Number} index
   * @param {*} key
   * @param {*} value
   */
  function handleEnumChange(index, key, value) {
    const newEnumItems = [...enumItems];
    newEnumItems[index] = { ...newEnumItems[index], [key]: value };
    setEnumItems(newEnumItems);
  }

  /**
   * 添加子字段
   */
  function handleSubFieldAdd() {
    setSubFields([...subFields, {}]);
  }

  /**
   * 删除子字段
   * @param {Number} index
   */
  function handleSubFieldRemove(index) {
    const newSubFields = [...subFields];
    newSubFields.splice(index, 1);
    setSubFields(newSubFields);
  }

  /**
   * 修改子字段
   * @param {Number} index
   * @param {*} key
   * @param {*} value
   */
  function handleSubFieldChange(index, key, value) {
    const newSubFields = [...subFields];
    newSubFields[index] = { ...newSubFields[index], [key]: value };
    setSubFields(newSubFields);
  }

  /**
   * 选择对象类型的数据模型
   * @param {Number} index
   */
  function handleObjectModelChange(index) {
    setSubFields(getModelProps(models[index]));
  }

  /**
   * 选择数组类型的数据模型
   * @param {Number} index
   */
  function handleArrayModelChange(index) {
    setArrayItems(getModelProps(models[index]));
    setData({
      ...data,
      items: {
        $ref: `#/definitions/${models[index].key}`,
      },
    });
  }

  /**
   * 重置表单
   */
  function handleReset() {
    setData({ ...defaultData });
    setEnumSource("custom");
    setEnumItems([...defaultEnumItems]);
    setSubFields([...defaultSubFields]);
    setArrayItems([...defaultArrayItems]);
  }

  /**
   * 提交表单
   */
  function handleSubmit() {
    console.log(model);
    console.log(data);

    if (!data.key || !data.format || !data.description) {
      message.error("字段名、格式、描述不能为空");
      return;
    }
    if (data["x-isExample"] && !data.example) {
      message.error("请填写示例值");
      return;
    }

    // if (formMode === "edit") {
    //   dispatch({
    //     type: "FIELD_UPDATE",
    //     payload: {
    //       definitionKey,
    //       inRequired,
    //       inExample,
    //       data,
    //     },
    //   });
    //   setVisible(false);
    // } else if (formMode === "create") {
    //   console.log(definitionKeys);
    //   if (definitionKeys.includes(data.key)) {
    //     message.error(`${data.key}字段名重复`);
    //     return;
    //   }
    // } else if (formMode === "copy") {
    // }
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
          <Form.Item label="字段名">
            <Input
              name="key"
              placeholder="请输入"
              value={data.key}
              onChange={handleChange}
              disabled={formMode === "edit"}
            />
          </Form.Item>
          <Form.Item label="字段类型">
            <Select
              name="format"
              placeholder="请选择"
              value={data.format}
              onChange={handleFormatChange}
              showSearch
              disabled={data["x-isEnum"]}
              filterOption={(input, option) =>
                option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {Object.keys(dataFormats).map(key => (
                <Option value={key} key={key}>
                  <span>{key}</span>
                  <span
                    style={{
                      color: "#999",
                    }}
                  >{` (${dataFormats[key][0]}, ${dataFormats[key][1]}, ${
                    dataFormats[key][2]
                  })`}</span>
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="是否枚举">
            <Checkbox
              name="x-isEnum"
              checked={data["x-isEnum"]}
              disabled={!["int4", "string", "char"].includes(data.format)}
              onChange={handleCheck}
            >
              isEnum
            </Checkbox>
          </Form.Item>
          <Form.Item label="描述">
            {data["x-isEnum"] ? (
              <Input
                name="x-description"
                placeholder="请输入"
                value={data["x-description"]}
                onChange={handleChange}
              />
            ) : (
              <Input
                name="描述"
                placeholder="请输入"
                value={data.description}
                onChange={handleChange}
              />
            )}
          </Form.Item>
          {data["x-isEnum"] && (
            <Form.Item
              label="枚举选项"
              validateStatus={
                enumItems.length === (data.enum || []).length
                  ? "success"
                  : "error"
              }
            >
              {enumItems.map((item, index) => (
                <div
                  key={index}
                  style={{
                    position: "relative",
                  }}
                >
                  <InputGroup compact>
                    {numTypes.includes(data.format) ? (
                      <InputNumber
                        style={{ width: "40%" }}
                        placeholder="Key"
                        value={item.value}
                        parser={input => ~~input}
                        onChange={value => {
                          handleEnumChange(index, "value", value);
                        }}
                      />
                    ) : (
                      <Input
                        style={{ width: "40%" }}
                        placeholder="Key"
                        value={item.value}
                        onChange={e => {
                          handleEnumChange(index, "value", e.target.value);
                        }}
                      />
                    )}
                    <Input
                      style={{ width: "60%" }}
                      placeholder="Value"
                      value={item.description}
                      onChange={e => {
                        handleEnumChange(index, "description", e.target.value);
                      }}
                    />
                  </InputGroup>
                  <Icon
                    style={{
                      position: "absolute",
                      right: -20,
                      top: 12,
                    }}
                    type="minus-circle-o"
                    onClick={() => {
                      handleEnumRemove(index);
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
                onClick={handleEnumAdd}
                icon="plus"
              >
                Add field
              </Button>
              <TextArea
                autosize
                disabled
                value={data.description}
                style={{
                  marginTop: 12,
                }}
              />
            </Form.Item>
          )}

          {data.format === "object" && (
            <Form.Item label="数据来源">
              <Radio.Group
                onChange={e => {
                  setEnumSource(e.target.value);
                }}
                value={enumSource}
              >
                <Radio value={"custom"}>Custom</Radio>
                <Radio value={"models"}>Models</Radio>
              </Radio.Group>
            </Form.Item>
          )}

          {data.format === "object" && enumSource === "models" && (
            <Form.Item label="数据模型">
              <Select placeholder="请选择" onChange={handleObjectModelChange}>
                {models.map(({ key, description }, index) => (
                  <Option
                    value={index}
                    key={index}
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

          {data.format === "array" && (
            <Form.Item label="数据模型">
              <Select
                placeholder="请选择"
                value={models
                  .map(({ key }) => `#/definitions/${key}`)
                  .indexOf(data.items && data.items["$ref"])}
                onChange={handleArrayModelChange}
              >
                {models.map(({ key, description }, index) => (
                  <Option
                    value={index}
                    key={index}
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

          {data.format === "object" && (
            <Form.Item label="子字段选项">
              {subFields.map((item, index) => (
                <div
                  key={index}
                  style={{
                    position: "relative",
                  }}
                >
                  <InputGroup compact>
                    <Select
                      placeholder="Type"
                      value={item.type}
                      style={{ width: "20%" }}
                      disabled={enumSource === "models"}
                      onChange={value => {
                        handleSubFieldChange(index, "type", value);
                      }}
                    >
                      {propTypes.map(key => (
                        <Option value={key} key={key}>
                          {key}
                        </Option>
                      ))}
                    </Select>
                    <Input
                      style={{ width: "20%" }}
                      placeholder="Key"
                      value={item.key}
                      disabled={enumSource === "models"}
                      onChange={e => {
                        handleSubFieldChange(index, "key", e.target.value);
                      }}
                    />
                    <Input
                      style={{ width: "20%" }}
                      placeholder="Description"
                      value={item.description}
                      disabled={enumSource === "models"}
                      onChange={e => {
                        handleSubFieldChange(
                          index,
                          "description",
                          e.target.value
                        );
                      }}
                    />
                    {item.type === "integer" || item.type === "number" ? (
                      <InputNumber
                        style={{ width: "40%" }}
                        placeholder="Example"
                        value={item.example}
                        onChange={value => {
                          handleSubFieldChange(index, "example", value);
                        }}
                      />
                    ) : (
                      <Input
                        style={{ width: "40%" }}
                        placeholder="Example"
                        value={item.example}
                        onChange={e => {
                          handleSubFieldChange(
                            index,
                            "example",
                            e.target.value
                          );
                        }}
                      />
                    )}
                  </InputGroup>
                  {enumSource === "custom" && (
                    <Icon
                      style={{
                        position: "absolute",
                        right: -20,
                        top: 12,
                      }}
                      type="minus-circle-o"
                      onClick={() => {
                        handleSubFieldRemove(index);
                      }}
                    />
                  )}
                </div>
              ))}
              {enumSource === "custom" && (
                <Button
                  style={{
                    width: "100%",
                    marginTop: 12,
                  }}
                  type="dashed"
                  onClick={handleSubFieldAdd}
                  icon="plus"
                >
                  Add field
                </Button>
              )}
            </Form.Item>
          )}

          {data.format === "array" && (
            <Form.Item label="数组字段">
              {arrayItems.map((item, index) => (
                <div
                  key={index}
                  style={{
                    position: "relative",
                  }}
                >
                  <InputGroup compact>
                    <Select
                      placeholder="Type"
                      value={item.type}
                      style={{ width: "20%" }}
                      disabled
                    >
                      {propTypes.map(key => (
                        <Option value={key} key={key}>
                          {key}
                        </Option>
                      ))}
                    </Select>
                    <Input
                      style={{ width: "20%" }}
                      placeholder="Key"
                      value={item.key}
                      disabled
                    />
                    <Input
                      style={{ width: "20%" }}
                      placeholder="Description"
                      value={item.description}
                      disabled
                    />
                    <Input
                      style={{ width: "40%" }}
                      placeholder="Example"
                      value={item.example}
                      disabled
                    />
                  </InputGroup>
                </div>
              ))}
            </Form.Item>
          )}

          {(data.format === "string" || data.format === "char") && (
            <Form.Item label="数据长度">
              <InputNumber
                name="x-length"
                placeholder="请输入"
                value={data["x-length"]}
                min={0}
                max={255}
                parser={input => ~~input}
                onChange={value => {
                  handleKvChange("x-length", value);
                }}
              />
            </Form.Item>
          )}

          {data.format === "string" && (
            <Form.Item label="长度范围">
              <InputGroup compact>
                <InputNumber
                  style={{ width: 100, textAlign: "center" }}
                  placeholder="MinLength"
                  value={data.minLength}
                  min={0}
                  max={255}
                  parser={input => ~~input}
                  onChange={value => {
                    handleKvChange("minLength", value);
                  }}
                />
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
                <InputNumber
                  style={{ width: 100, textAlign: "center", borderLeft: 0 }}
                  placeholder="MaxLength"
                  value={data.maxLength}
                  min={0}
                  max={255}
                  parser={input => ~~input}
                  onChange={value => {
                    handleKvChange("maxLength", value);
                  }}
                />
              </InputGroup>
            </Form.Item>
          )}
          {numTypes.includes(data.format) && (
            <Form.Item label="大小范围">
              <InputGroup compact>
                <InputNumber
                  style={{ width: 100, textAlign: "center" }}
                  placeholder="Minimum"
                  value={data.minimum}
                  parser={input => ~~input}
                  onChange={value => {
                    handleKvChange("minimum", value);
                  }}
                />
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
                <InputNumber
                  style={{ width: 100, textAlign: "center", borderLeft: 0 }}
                  placeholder="Maximum"
                  value={data.maximum}
                  parser={input => ~~input}
                  onChange={value => {
                    handleKvChange("maximum", value);
                  }}
                />
              </InputGroup>
            </Form.Item>
          )}
          <Form.Item label="提示信息">
            <Input
              name="x-message"
              placeholder="请输入"
              value={data["x-message"]}
              onChange={handleChange}
            />
          </Form.Item>

          {(() => {
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
                      {data.enum.map(key => (
                        <Option value={key} key={key}>
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
                      {data.enum.map(key => (
                        <Option value={key} key={key}>
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
          })()}

          <Form.Item label="其他选项">
            <Checkbox
              name="uniqueItems"
              checked={data.uniqueItems}
              onChange={handleCheck}
            >
              Unique
            </Checkbox>
            <Checkbox
              name="x-isRequired"
              checked={data["handleCheck"]}
              onChange={handleCheck}
            >
              Required
            </Checkbox>
            <Checkbox
              name="x-isExample"
              checked={data["x-isExample"]}
              onChange={handleCheck}
            >
              InExample
            </Checkbox>
          </Form.Item>
          <Form.Item label="表单选项">
            <Checkbox
              name="x-showTable"
              checked={data["x-showTable"]}
              onChange={handleCheck}
            >
              showInTable
            </Checkbox>
            <Checkbox
              name="x-showFilter"
              checked={data["x-showFilter"]}
              onChange={handleCheck}
            >
              showFilter
            </Checkbox>
            <Checkbox
              name="x-showSorter"
              checked={data["x-showSorter"]}
              onChange={handleCheck}
            >
              showSorter
            </Checkbox>
            {data.format === "text" && (
              <Checkbox
                name="x-isRichText"
                checked={data["x-isRichText"]}
                onChange={handleCheck}
              >
                useRichText
              </Checkbox>
            )}
          </Form.Item>
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
