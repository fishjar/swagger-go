import React, { Fragment, useState, useEffect } from "react";
import moment from "moment";
import {
  formItemLayout,
  dataFormats,
  numTypes,
  isObj,
  propTypes,
} from "../config";
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

function DefinitionDrawer({
  children,
  dispatch,
  title = "编辑",
  formMode = "edit",
  definitionKey,
  defaultData = {},
  requiredArr = [],
  exampleArr = [],
  definitions = [],
}) {
  const getDefinitionProps = definition => {
    if (!definition || !isObj(definition.properties)) {
      return [];
    }
    return Object.keys(definition.properties).map(key => ({
      key,
      type: definition.properties[key].type,
      description: definition.properties[key].description,
      example:
        definition.properties[key].example ||
        (definition.example &&
          definition.example[key] &&
          definition.example[key].toString()),
    }));
  };
  const defaultEnumArr = () => {
    if (!(defaultData.enum && Array.isArray(defaultData.enum))) {
      return [];
    }
    if (defaultData["x-enumMap"]) {
      return Object.keys(defaultData["x-enumMap"]).map(value => ({
        value,
        describe: defaultData["x-enumMap"][value],
      }));
    }
    return defaultData.enum.map(value => ({
      value,
      describe: null,
    }));
  };
  const defaultPropArr = () => getDefinitionProps(defaultData);
  const defaultArrayItems = () => {
    const ref = defaultData.items && defaultData.items["$ref"];
    if (!ref) {
      return [];
    }
    if (definitions.length === 0) {
      return [];
    }
    const refs = definitions.map(
      definition => `#/definitions/${definition.key}`
    );
    const index = refs.indexOf(ref);
    if (index === -1) {
      return [];
    }
    return getDefinitionProps(definitions[index]);
  };

  const [visible, setVisible] = useState(false);
  const [data, setData] = useState({ ...defaultData });
  const [inRequired, setInRequired] = useState(
    requiredArr.includes(defaultData.key)
  );
  const [inExample, setInExample] = useState(
    exampleArr.includes(defaultData.key)
  );
  const [enumArr, setEnumArr] = useState(defaultEnumArr());
  const [propsSource, setPropsSource] = useState("custom");
  const [propArr, setPropArr] = useState(defaultPropArr());
  const [arrayItems, setArrayItems] = useState(defaultArrayItems());

  // useEffect(() => {
  //   setData({
  //     ...data,
  //     "x-length": defaultData["x-length"] || 255,
  //   });
  // }, [data.format]);

  useEffect(() => {
    const newEnum = [];
    const describe = {};
    let description = `"${data["x-description"]}"`;
    if (data.enum) {
      enumArr
        .filter(item => item.value)
        .forEach(item => {
          newEnum.push(
            numTypes.includes(data.format) ? ~~item.value : item.value
          );
          describe[item.value] = item.describe;
          description += `\n  * ${item.value} - ${item.describe || ""}`;
        });

      setData({
        ...data,
        enum: [...new Set(newEnum)],
        description,
        "x-enumMap": describe,
        default: newEnum.includes(data.default) ? data.default : newEnum[0],
        example: newEnum.includes(data.example) ? data.example : newEnum[0],
      });
    }
  }, [enumArr]);

  useEffect(() => {
    const newData = { ...data };
    if (propArr.length > 0) {
      const properties = {};
      propArr
        .filter(item => item.key && item.type)
        .forEach(item => {
          properties[item.key] = {
            type: item.type,
            description: item.description,
            example: item.example,
          };
        });

      setData({
        ...newData,
        properties,
      });
    } else if (newData.properties) {
      delete newData.properties;
      setData(newData);
    }
  }, [propArr]);

  function handleChange(e) {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  }
  function handleCheck(e) {
    const { name, checked } = e.target;
    setData({
      ...data,
      [name]: checked,
    });
  }
  function handleHide() {
    handleReset();
    setVisible(false);
  }
  function handleFormatChange(value) {
    setData({
      ...data,
      format: value,
      type: dataFormats[value][0],
    });
  }
  function handleKvChange(key, value) {
    setData({
      ...data,
      [key]: value,
    });
  }
  function handleKvDelete(key) {
    const newData = { ...data };
    delete newData[key];
    setData(newData);
  }
  function handleEnum(e) {
    const { checked } = e.target;
    const newData = { ...data };
    if (checked) {
      newData.enum = enumArr
        .filter(item => item.value)
        .map(item =>
          numTypes.includes(data.format) ? ~~item.value : item.value
        );
    } else {
      delete newData.enum;
    }
    setData(newData);
  }
  function handleAddEnum() {
    setEnumArr([...enumArr, {}]);
  }
  function handleRemoveEnum(index) {
    const newEnumArr = [...enumArr];
    newEnumArr.splice(index, 1);
    setEnumArr(newEnumArr);
  }
  function handleChangeEnumValue(index, value) {
    const newEnumArr = [...enumArr];
    newEnumArr[index] = { ...newEnumArr[index], value };
    setEnumArr(newEnumArr);
  }
  function handleChangeEnumDescribe(index, describe) {
    const newEnumArr = [...enumArr];
    newEnumArr[index] = { ...newEnumArr[index], describe };
    setEnumArr(newEnumArr);
  }
  function handleChangeProp(index, key, value) {
    const newPropArr = [...propArr];
    newPropArr[index] = { ...newPropArr[index], [key]: value };
    setPropArr(newPropArr);
  }
  function handleAddProp() {
    setPropArr([...propArr, {}]);
  }
  function handleRemoveProp(index) {
    const newPropArr = [...propArr];
    newPropArr.splice(index, 1);
    setPropArr(newPropArr);
  }
  function handleChangePropModel(index) {
    setPropArr(getDefinitionProps(definitions[index]));
  }
  function handleChangeArrayModel(index) {
    setArrayItems(getDefinitionProps(definitions[index]));
    setData({
      ...data,
      items: {
        $ref: `#/definitions/${definitions[index].key}`,
      },
    });
  }

  function handleReset() {
    setData({ ...defaultData });
    setInRequired(requiredArr.includes(defaultData.key));
    setInExample(exampleArr.includes(defaultData.key));
    setEnumArr(defaultEnumArr());
    setPropsSource("custom");
    setPropArr(defaultPropArr());
    setArrayItems(defaultArrayItems());
  }
  function handleSubmit() {
    console.log(data);
    console.log("inRequired", inRequired);
    console.log("inExample", inExample);
    if (!data.key || !data.format || !data.description) {
      message.error("字段名、格式、描述不能为空");
      return;
    }
    if (inExample && (data.example === undefined || data.example === null)) {
      message.error("请填写示例值");
      return;
    }

    dispatch({
      type: "FIELD_UPDATE",
      payload: {
        definitionKey,
        inRequired,
        inExample,
        data,
      },
    });
    setVisible(false);
  }

  return (
    <span>
      <span
        onClick={() => {
          setVisible(true);
        }}
        style={{
          cursor: "pointer",
        }}
      >
        {children}
      </span>
      <Drawer title={title} width="60%" onClose={handleHide} visible={visible}>
        <Form {...formItemLayout}>
          <Form.Item label="Field">
            <Input
              name="key"
              placeholder="请输入"
              value={data.key}
              onChange={handleChange}
              disabled={formMode === "edit"}
            />
          </Form.Item>
          <Form.Item label="Format">
            <Select
              name="format"
              placeholder="请选择"
              value={data.format}
              onChange={handleFormatChange}
              showSearch
              disabled={!!data.enum}
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
          <Form.Item label="Enum">
            <Checkbox
              name="enum"
              checked={!!data.enum}
              disabled={!["int4", "string", "char"].includes(data.format)}
              onChange={handleEnum}
            >
              isEnum
            </Checkbox>
          </Form.Item>
          <Form.Item label="Description">
            {data.enum ? (
              <Input
                name="x-description"
                placeholder="请输入"
                value={data["x-description"]}
                onChange={handleChange}
              />
            ) : (
              <Input
                name="description"
                placeholder="请输入"
                value={data.description}
                onChange={handleChange}
              />
            )}
          </Form.Item>
          {data.enum && (
            <Form.Item
              label="Enum Items"
              validateStatus={
                enumArr.length === (data.enum || []).length
                  ? "success"
                  : "error"
              }
            >
              {enumArr.map((item, index) => (
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
                        onChange={value => {
                          handleChangeEnumValue(index, value);
                        }}
                      />
                    ) : (
                      <Input
                        style={{ width: "40%" }}
                        placeholder="Key"
                        value={item.value}
                        onChange={e => {
                          handleChangeEnumValue(index, e.target.value);
                        }}
                      />
                    )}
                    <Input
                      style={{ width: "60%" }}
                      placeholder="Value"
                      value={item.describe}
                      onChange={e => {
                        handleChangeEnumDescribe(index, e.target.value);
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
                      handleRemoveEnum(index);
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
                onClick={handleAddEnum}
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
            <Form.Item label="Properties Source">
              <Radio.Group
                onChange={e => {
                  setPropsSource(e.target.value);
                }}
                value={propsSource}
              >
                <Radio value={"custom"}>Custom</Radio>
                <Radio value={"models"}>Models</Radio>
              </Radio.Group>
            </Form.Item>
          )}

          {data.format === "object" && propsSource === "models" && (
            <Form.Item label="Source Model">
              <Select
                placeholder="请选择"
                // value={data.format}
                onChange={handleChangePropModel}
              >
                {definitions.map((definition, index) => (
                  <Option
                    value={index}
                    key={index}
                    disabled={definitionKey === definition.key}
                  >
                    <span>{`#/definitions/${definition.key}`}</span>
                    <span
                      style={{
                        color: "#999",
                      }}
                    >{` (${definition.description})`}</span>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {data.format === "array" && (
            <Form.Item label="Source Model">
              <Select
                placeholder="请选择"
                value={definitions
                  .map(definition => `#/definitions/${definition.key}`)
                  .indexOf(data.items && data.items["$ref"])}
                onChange={handleChangeArrayModel}
              >
                {definitions.map((definition, index) => (
                  <Option
                    value={index}
                    key={index}
                    disabled={definitionKey === definition.key}
                  >
                    <span>{`#/definitions/${definition.key}`}</span>
                    <span
                      style={{
                        color: "#999",
                      }}
                    >{` (${definition.description})`}</span>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {data.format === "object" && (
            <Form.Item label="Properties">
              {propArr.map((item, index) => (
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
                      disabled={propsSource === "models"}
                      onChange={value => {
                        handleChangeProp(index, "type", value);
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
                      disabled={propsSource === "models"}
                      onChange={e => {
                        handleChangeProp(index, "key", e.target.value);
                      }}
                    />
                    <Input
                      style={{ width: "20%" }}
                      placeholder="Description"
                      value={item.description}
                      disabled={propsSource === "models"}
                      onChange={e => {
                        handleChangeProp(index, "description", e.target.value);
                      }}
                    />
                    {item.type === "integer" || item.type === "number" ? (
                      <InputNumber
                        style={{ width: "40%" }}
                        placeholder="Example"
                        value={item.example}
                        onChange={value => {
                          handleChangeProp(index, "example", value);
                        }}
                      />
                    ) : (
                      <Input
                        style={{ width: "40%" }}
                        placeholder="Example"
                        value={item.example}
                        onChange={e => {
                          handleChangeProp(index, "example", e.target.value);
                        }}
                      />
                    )}
                  </InputGroup>
                  {propsSource === "custom" && (
                    <Icon
                      style={{
                        position: "absolute",
                        right: -20,
                        top: 12,
                      }}
                      type="minus-circle-o"
                      onClick={() => {
                        handleRemoveProp(index);
                      }}
                    />
                  )}
                </div>
              ))}
              {propsSource === "custom" && (
                <Button
                  style={{
                    width: "100%",
                    marginTop: 12,
                  }}
                  type="dashed"
                  onClick={handleAddProp}
                  icon="plus"
                >
                  Add field
                </Button>
              )}
            </Form.Item>
          )}

          {data.format === "array" && (
            <Form.Item label="Array Items">
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
            <Form.Item label="Limit">
              <InputNumber
                name="x-length"
                placeholder="请输入"
                value={data["x-length"]}
                min={0}
                max={255}
                onChange={value => {
                  handleKvChange("x-length", value);
                }}
              />
            </Form.Item>
          )}
          {data.format === "string" && (
            <Form.Item label="Between">
              <InputGroup compact>
                <InputNumber
                  style={{ width: 100, textAlign: "center" }}
                  placeholder="MinLength"
                  value={data.minLength}
                  min={0}
                  max={255}
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
                  onChange={value => {
                    handleKvChange("maxLength", value);
                  }}
                />
              </InputGroup>
            </Form.Item>
          )}
          {numTypes.includes(data.format) && (
            <Form.Item label="Between">
              <InputGroup compact>
                <InputNumber
                  style={{ width: 100, textAlign: "center" }}
                  placeholder="Minimum"
                  value={data.minimum}
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
                  onChange={value => {
                    handleKvChange("maximum", value);
                  }}
                />
              </InputGroup>
            </Form.Item>
          )}
          <Form.Item label="Placeholder">
            <Input
              name="x-message"
              placeholder="请输入"
              value={data["x-message"]}
              onChange={handleChange}
            />
          </Form.Item>

          {(() => {
            if (data.enum) {
              return (
                <Fragment>
                  <Form.Item label="Default">
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
                        <span>null</span>
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
                  <Form.Item label="Example">
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
                        <span>null</span>
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
                  <Form.Item label="Default">
                    <InputNumber
                      name="default"
                      placeholder="请输入"
                      value={data.default}
                      onChange={value => {
                        handleKvChange("default", value);
                      }}
                    />
                  </Form.Item>
                  <Form.Item label="Example">
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
                  <Form.Item label="Default">
                    <DatePicker
                      name="default"
                      value={data.default ? moment(data.default) : null}
                      onChange={(_, dateString) => {
                        handleKvChange("default", dateString);
                      }}
                    />
                  </Form.Item>
                  <Form.Item label="Example">
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
                  <Form.Item label="Default">
                    <DatePicker
                      showTime
                      name="default"
                      value={data.default ? moment(data.default) : null}
                      onChange={(_, dateString) => {
                        handleKvChange("default", dateString);
                      }}
                    />
                  </Form.Item>
                  <Form.Item label="Example">
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
                  <Form.Item label="Default">
                    <TextArea
                      autosize
                      name="default"
                      placeholder="请输入"
                      value={data.default}
                      onChange={handleChange}
                    />
                  </Form.Item>
                  <Form.Item label="Example">
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
                  <Form.Item label="Default">
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
                  <Form.Item label="Example">
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
                  <Form.Item label="Default">
                    <Input
                      name="default"
                      placeholder="请输入"
                      value={data.default}
                      onChange={handleChange}
                    />
                  </Form.Item>
                  <Form.Item label="Example">
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

          <Form.Item label="Data Options">
            <Checkbox
              name="uniqueItems"
              checked={data.uniqueItems}
              onChange={handleCheck}
            >
              Unique
            </Checkbox>
            <Checkbox
              name="inRequired"
              checked={inRequired}
              onChange={e => {
                setInRequired(e.target.checked);
              }}
            >
              Required
            </Checkbox>
            <Checkbox
              name="inExample"
              checked={inExample}
              onChange={e => {
                setInExample(e.target.checked);
              }}
            >
              InExample
            </Checkbox>
          </Form.Item>
          <Form.Item label="Form Options">
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

export default function Definition({ definitions, definition, dispatch }) {
  const data = Object.keys(definition.properties).map((key, index) => ({
    ...definition.properties[key],
    key,
    index,
  }));
  const requiredArr = definition.required || [];
  const exampleArr = Object.keys(definition.example || {});
  const columns = [
    {
      title: "Index",
      dataIndex: "index",
      render: text => text,
    },
    {
      title: "Field",
      dataIndex: "key",
      render: (text, record) => (
        <Badge
          status={requiredArr.includes(record.key) ? "success" : "default"}
          text={text}
          style={record.uniqueItems ? { color: "#52c41a" } : {}}
        />
      ),
    },
    {
      title: "Type ( Format )",
      dataIndex: "format",
      render: (text, record) =>
        `${record.type} ( ${text} )` + `${record.enum ? " ( enum )" : ""}`,
    },
    {
      title: "Description ( Placeholder )",
      dataIndex: "description",
      render: (text, record) =>
        `${text}` + (record["x-message"] ? ` (${record["x-message"]})` : ""),
    },
    {
      title: "Form",
      dataIndex: "x-showTable",
      render: (_, record) => (
        <div>
          {record["x-showTable"] && (
            <div>
              <Badge status="success" text="showTable" />
            </div>
          )}
          {record["x-showFilter"] && (
            <div>
              <Badge status="success" text="showFilter" />
            </div>
          )}
          {record["x-showSorter"] && (
            <div>
              <Badge status="success" text="showSorter" />
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Default",
      dataIndex: "default",
      render: (_, record) => (
        <div>
          {record.default !== undefined && (
            <div>default: {record.default.toString()}</div>
          )}
          {record.minLength !== undefined && (
            <div>minLength: {record.minLength}</div>
          )}
          {record.maxLength !== undefined && (
            <div>maxLength: {record.maxLength}</div>
          )}
          {record.minimum !== undefined && <div>minimum: {record.minimum}</div>}
          {record.maximum !== undefined && <div>maximum: {record.maximum}</div>}
        </div>
      ),
    },
    {
      title: "Example",
      dataIndex: "example",
      render: (text, record) => (
        <Badge
          status={exampleArr.includes(record.key) ? "success" : "default"}
          text={
            text ||
            (definition.example &&
              definition.example[record.key] &&
              definition.example[record.key].toString())
          }
        />
      ),
    },
    {
      title: "操作",
      key: "action",
      render: (text, record) => (
        <span>
          <DefinitionDrawer
            destroyOnClose
            title="编辑"
            formMode="edit"
            dispatch={dispatch}
            definitions={definitions}
            defaultData={record}
            requiredArr={requiredArr}
            exampleArr={exampleArr}
            definitionKey={definition.key}
          >
            <Icon type="edit" />
          </DefinitionDrawer>
          <Divider type="vertical" />
          <Icon type="copy" onClick={() => {}} />
          <Divider type="vertical" />
          <Icon
            type="close"
            onClick={event => {
              // If you don't want click extra trigger collapse, you can prevent this:
              event.stopPropagation();
            }}
          />
        </span>
      ),
    },
  ];

  return (
    <Fragment>
      <Table
        columns={columns}
        bordered
        dataSource={data}
        pagination={false}
        size="middle"
      />
      <DefinitionDrawer
        destroyOnClose
        title="新增"
        formMode="creat"
        dispatch={dispatch}
        definitions={definitions}
        defaultData={{}}
        requiredArr={[]}
        exampleArr={[]}
        definitionKey={definition.key}
      >
        <Button
          style={{
            width: "100%",
            marginTop: 16,
            marginBottom: 8,
          }}
          type="dashed"
          onClick={() => {}}
          icon="plus"
        >
          Add field
        </Button>
      </DefinitionDrawer>
    </Fragment>
  );
}
