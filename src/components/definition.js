import React, { Fragment, useState, useEffect } from "react";
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
} from "antd";
const { Panel } = Collapse;
const CheckboxGroup = Checkbox.Group;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

function DefinitionDrawer({ children, title = "新增", defaultData = {} }) {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState(defaultData);
  function handleChange(e) {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  }
  function handleHide() {
    setData({ ...defaultData });
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
      <Drawer title={title} width="50%" onClose={handleHide} visible={visible}>
        <Form {...formItemLayout}>
          <Form.Item label="Field">
            <Input
              name="key"
              placeholder="keyName"
              value={data.key}
              onChange={handleChange}
            />
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
          <Button onClick={() => {}} type="primary">
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
          {/* <Icon
            type="edit"
            onClick={event => {
              setDrawerVisible(true);
              setDrawerTitle("编辑");
              setDrawerData(record);
              event.stopPropagation();
            }}
          /> */}
          <DefinitionDrawer defaultData={record}>
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
