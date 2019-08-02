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
  Badge
} from "antd";
const { Panel } = Collapse;
const CheckboxGroup = Checkbox.Group;

export default function Definition({ definition, dispatch }) {
  const data = Object.keys(definition.properties).map((key, index) => ({
    ...definition.properties[key],
    key,
    index
  }));
  const requiredArr = definition.required || [];
  const exampleArr = Object.keys(definition.example || {});
  const columns = [
    {
      title: "Index",
      dataIndex: "index",
      render: text => text
    },
    {
      title: "Key",
      dataIndex: "key",
      render: (text, record) => (
        <Badge
          status={requiredArr.includes(record.key) ? "success" : "default"}
          text={text}
          style={record.uniqueItems ? { color: "#52c41a" } : {}}
        />
      )
    },
    {
      title: "Format ( Type )",
      dataIndex: "format",
      render: (text, record) =>
        `${text} ( ${record.type} )` + `${record.enum ? " ( enum )" : ""}`
    },
    {
      title: "Description ( Placeholder )",
      dataIndex: "description",
      render: (text, record) =>
        `${text}` + (record["x-message"] ? ` (${record["x-message"]})` : "")
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
      )
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
      )
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
      )
    },
    {
      title: "操作",
      key: "action",
      render: (text, record) => (
        <span>
          <a onClick={e => this.toggleEditable(e, record.key)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm
            title="是否要删除此行？"
            onConfirm={() => this.remove(record.key)}
          >
            <a>删除</a>
          </Popconfirm>
        </span>
      )
    }
  ];

  return (
    <Fragment>
      <Table
        columns={columns}
        bordered
        title={() => "Header"}
        dataSource={data}
        pagination={false}
        size="middle"
      />
      <Button
        style={{
          width: "100%",
          marginTop: 16,
          marginBottom: 8
        }}
        type="dashed"
        onClick={() => {}}
        icon="plus"
      >
        新增成员
      </Button>
    </Fragment>
  );
}
