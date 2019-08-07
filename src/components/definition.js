import React, { Fragment, useState, useEffect } from "react";
import moment from "moment";
import { formItemLayout, dataFormats, numTypes } from "../config";
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
} from "antd";
const { Panel } = Collapse;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;
const InputGroup = Input.Group;
const { TextArea } = Input;

function DefinitionDrawer({
  children,
  title = "新增",
  defaultData = {},
  requiredArr = [],
  exampleArr = [],
}) {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState({ ...defaultData });
  const [inRequired, setInRequired] = useState(
    requiredArr.includes(defaultData.key)
  );
  const [inExample, setInExample] = useState(
    exampleArr.includes(defaultData.key)
  );
  const [enumArr, setEnumArr] = useState(() => {
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
  });

  useEffect(() => {
    setData({
      ...data,
      "x-length": defaultData["x-length"] || 255,
    });
  }, [data.format]);

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
  function handleReset() {
    setData({ ...defaultData });
    setInRequired(requiredArr.includes(defaultData.key));
    setInExample(exampleArr.includes(defaultData.key));
    setEnumArr(() => {
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
  function handleSubmit() {
    console.log(data);
    console.log(inRequired);
    console.log(inExample);
    console.log(enumArr);
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
            />
          </Form.Item>
          <Form.Item label="Format">
            <Select
              name="format"
              placeholder="请选择"
              value={data.format}
              onChange={handleFormatChange}
              showSearch
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
            <Checkbox name="enum" checked={!!data.enum} onChange={handleEnum}>
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
              );
            } else if (numTypes.includes(data.format)) {
              return (
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
              );
            } else if (data.format === "date") {
              return (
                <Form.Item label="Default">
                  <DatePicker
                    name="default"
                    value={data.default && moment(data.default)}
                    onChange={(_, dateString) => {
                      console.log(dateString);
                      handleKvChange("default", dateString);
                    }}
                  />
                </Form.Item>
              );
            } else if (data.format === "date-time") {
              return (
                <Form.Item label="Default">
                  <DatePicker
                    showTime
                    name="default"
                    value={data.default && moment(data.default)}
                    onChange={(_, dateString) => {
                      console.log(dateString);
                      handleKvChange("default", dateString);
                    }}
                  />
                </Form.Item>
              );
            } else if (data.format === "text") {
              return (
                <Form.Item label="Default">
                  <TextArea
                    autosize
                    name="default"
                    placeholder="请输入"
                    value={data.default}
                    onChange={handleChange}
                  />
                </Form.Item>
              );
            } else if (data.format !== "object" && data.format !== "array") {
              return (
                <Form.Item label="Default">
                  <Input
                    name="default"
                    placeholder="请输入"
                    value={data.default}
                    onChange={handleChange}
                  />
                </Form.Item>
              );
            }
          })()}

          {(() => {
            if (data.enum) {
              return (
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
              );
            } else if (numTypes.includes(data.format)) {
              return (
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
              );
            } else {
              return (
                <Form.Item label="Example">
                  <Input
                    name="example"
                    placeholder="请输入"
                    value={data.example}
                    onChange={handleChange}
                  />
                </Form.Item>
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

export default function Definition({ definition, dispatch }) {
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
      title: "Format ( Type )",
      dataIndex: "format",
      render: (text, record) =>
        `${text} ( ${record.type} )` + `${record.enum ? " ( enum )" : ""}`,
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
        <div>
          <Badge
            status={exampleArr.includes(record.key) ? "success" : "default"}
          />
          {text}
        </div>
      ),
    },
    {
      title: "操作",
      key: "action",
      render: (text, record) => (
        <span>
          <DefinitionDrawer
            title="编辑"
            defaultData={record}
            requiredArr={requiredArr}
            exampleArr={exampleArr}
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
      {/* <DefinitionDrawer
        title={drawerTitle}
        visible={drawerVisible}
        handlerVisible={setDrawerVisible}
        defaultData={drawerData}
      /> */}
    </Fragment>
  );
}
