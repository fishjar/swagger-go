import React, { Fragment, useState, useEffect, forwardRef } from "react";
import moment from "moment";
import { formItemLayout, dataFormats, numTypes, propTypes } from "../../config";
import { getModelProps } from "../../utils";
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

export default function SubField({
  value: subFields = [],
  objectSource,
  onChange,
}) {
  /**
   * 添加子字段
   */
  function handleSubFieldAdd() {
    onChange([...subFields, {}]);
  }

  /**
   * 删除子字段
   * @param {Number} index
   */
  function handleSubFieldRemove(index) {
    const newSubFields = [...subFields];
    newSubFields.splice(index, 1);
    onChange(newSubFields);
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
    onChange(newSubFields);
  }

  return (
    <Fragment>
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
              disabled={objectSource === "models"}
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
              disabled={objectSource === "models"}
              onChange={e => {
                handleSubFieldChange(index, "key", e.target.value);
              }}
            />
            <Input
              style={{ width: "20%" }}
              placeholder="Description"
              value={item.description}
              disabled={objectSource === "models"}
              onChange={e => {
                handleSubFieldChange(index, "description", e.target.value);
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
                  handleSubFieldChange(index, "example", e.target.value);
                }}
              />
            )}
          </InputGroup>
          {objectSource === "custom" && (
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
      {objectSource === "custom" && (
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
    </Fragment>
  );
}
