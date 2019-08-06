import React, { Fragment, useState, useEffect } from "react";
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
} from "antd";
const { Panel } = Collapse;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;

function DefinitionDrawer({
  children,
  title = "新增",
  defaultData = {},
  requiredArr = [],
  exampleArr = [],
}) {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState(defaultData);
  const [inRequired, setInRequired] = useState(
    requiredArr.includes(defaultData.key)
  );
  const [inExample, setInExample] = useState(
    exampleArr.includes(defaultData.key)
  );

  useEffect(() => {
    setData({
      ...data,
      ["x-length"]: defaultData["x-length"] || 255,
    });
  }, [data.format]);

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
    setData({ ...defaultData });
    setInRequired(requiredArr.includes(defaultData.key));
    setInExample(exampleArr.includes(defaultData.key));
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
  function handleSubmit() {
    console.log(data);
    console.log(inRequired);
    console.log(inExample);
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
      <Drawer title={title} width="50%" onClose={handleHide} visible={visible}>
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
              defaultValue={data.format}
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
          {(data.format === "string" || data.format === "char") && (
            <Form.Item label="Length">
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
            <Form.Item label="MinLength">
              <InputNumber
                name="minLength"
                placeholder="请输入"
                value={data.minLength}
                min={0}
                max={255}
                onChange={value => {
                  handleKvChange("minLength", value);
                }}
              />
            </Form.Item>
          )}
          {data.format === "string" && (
            <Form.Item label="MaxLength">
              <InputNumber
                name="maxLength"
                placeholder="请输入"
                value={data.maxLength}
                min={0}
                max={255}
                onChange={value => {
                  handleKvChange("maxLength", value);
                }}
              />
            </Form.Item>
          )}
          {numTypes.includes(data.format) && (
            <Form.Item label="Minimum">
              <InputNumber
                name="minimum"
                placeholder="请输入"
                value={data.minimum}
                onChange={value => {
                  handleKvChange("minimum", value);
                }}
              />
            </Form.Item>
          )}
          {numTypes.includes(data.format) && (
            <Form.Item label="Maximum">
              <InputNumber
                name="maximum"
                placeholder="请输入"
                value={data.maximum}
                onChange={value => {
                  handleKvChange("maximum", value);
                }}
              />
            </Form.Item>
          )}
          <Form.Item label="Description">
            <Input
              name="description"
              placeholder="请输入"
              value={data.description}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item label="Placeholder">
            <Input
              name="x-message"
              placeholder="请输入"
              value={data["x-message"]}
              onChange={handleChange}
            />
          </Form.Item>
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
            <Checkbox
              name="x-isRichText"
              checked={data["x-isRichText"]}
              onChange={handleCheck}
            >
              useRichText
            </Checkbox>
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
        新增成员
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
