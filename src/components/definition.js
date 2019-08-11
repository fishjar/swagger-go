import React, { Fragment, useState, useEffect } from "react";
import moment from "moment";
import FieldEditDrawer from "./fieldEditDrawer";
import FieldCopyDrawer from "./fieldCopyDrawer";
import { getModelProps } from "../utils";
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
    "x-isEnum": Array.isArray(model.properties[key].enum),
    "x-isRequired": (model.required || []).includes(key),
    "x-isExample": Object.keys(model.example || {}).includes(key),
    key,
  }));

  /**
   * 删除字段
   * @param {String} fieldKey
   */
  function handleFieldRemove(fieldKey) {
    const { key: modelKey, ...modelData } = model;
    const { properties = {}, required = [], example = {} } = modelData;

    delete properties[fieldKey];
    delete example[fieldKey];

    dispatch({
      type: "MODEL_UPDATE",
      payload: {
        [modelKey]: {
          ...modelData,
          required: required.filter(item => item === fieldKey),
          example,
          properties,
        },
      },
    });
  }

  const columns = [
    {
      title: "Index",
      dataIndex: "index",
      render: (_, __, index) => index + 1,
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
      title: "Placeholder - Description",
      dataIndex: "description",
      render: (text, record) => {
        if (record["x-isEnum"]) {
          return (
            <div>
              <div>{`${record["x-message"] || ""} - ${
                record["x-description"]
              }`}</div>
              <ul>
                {record["x-enumMap"]
                  ? Object.keys(record["x-enumMap"]).map(key => (
                      <li key={key}>
                        {key} - {record["x-enumMap"][key]}
                      </li>
                    ))
                  : record.enum.map(key => <li key={key}>{key}</li>)}
              </ul>
            </div>
          );
        } else if (record.format === "object") {
          return (
            <div>
              <div>{`${record["x-message"] || ""} - ${text}`}</div>
              <ul>
                {Object.keys(record.properties).map(key => (
                  <li key={key}>
                    {record.properties[key].type} - {key} (
                    {record.properties[key].description})
                  </li>
                ))}
              </ul>
            </div>
          );
        } else if (record.format === "array") {
          return (
            <div>
              <div>{`${record["x-message"] || ""} - ${text}`}</div>
              <ul>
                {getModelProps(
                  models.find(
                    item =>
                      item.key ===
                      ((record.items && record.items["$ref"]) || "").replace(
                        "#/definitions/",
                        ""
                      )
                  )
                ).map(item => (
                  <li key={item.key}>
                    {item.type} - {item.key} ({item.description})
                  </li>
                ))}
              </ul>
            </div>
          );
        }
        return `${record["x-message"] || ""} - ${text}`;
      },
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
          <FieldEditDrawer
            title="编辑"
            formMode="edit"
            dispatch={dispatch}
            models={models}
            model={model}
            fields={fields}
            field={record}
          >
            <Icon type="edit" />
          </FieldEditDrawer>
          <Divider type="vertical" />
          <FieldCopyDrawer
            title="复制"
            dispatch={dispatch}
            models={models}
            model={model}
            fields={fields}
            field={record}
          >
            <Icon type="copy" />
          </FieldCopyDrawer>
          <Divider type="vertical" />
          <Icon
            type="close"
            onClick={() => {
              handleFieldRemove(record.key);
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
      <FieldEditDrawer
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
      </FieldEditDrawer>
    </Fragment>
  );
}
