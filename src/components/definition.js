import React, { Fragment, useState, useEffect } from "react";
import moment from "moment";
import DefinitionDrawer from "./definitionDrawer";
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

export default function Definition({ models, model, dispatch }) {
  /**
   * 计算值
   * 将字段对象转为字段列表
   */
  const fields = Object.keys(model.properties).map(key => ({
    ...model.properties[key],
    "x-isEnum":
      model.properties[key].enum && Array.isArray(model.properties[key].enum),
    "x-isRequired": (model.required || []).includes(key),
    "x-isExample": Object.keys(model.example || {}).includes(key),
    key,
  }));
  // const requiredArr = definition.required || [];
  // const exampleArr = Object.keys(definition.example || {});

  const columns = [
    {
      title: "Index",
      dataIndex: "index",
      render: (_, __, index) => index,
    },
    {
      title: "Field",
      dataIndex: "key",
      render: (text, record) => (
        <Badge
          status={record["x-isRequired"] ? "success" : "default"}
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
          status={record["x-isExample"] ? "success" : "default"}
          text={
            text ||
            (model.example &&
              model.example[record.key] &&
              model.example[record.key].toString())
          }
        />
      ),
    },
    {
      title: "操作",
      render: (text, record) => (
        <span>
          <DefinitionDrawer
            title="编辑"
            formMode="edit"
            dispatch={dispatch}
            models={models}
            model={model}
            fields={fields}
            field={record}
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
        dataSource={fields}
        pagination={false}
        size="middle"
      />
      <DefinitionDrawer
        title="新增"
        formMode="create"
        dispatch={dispatch}
        models={models}
        model={model}
        fields={fields}
        field={{}}
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
