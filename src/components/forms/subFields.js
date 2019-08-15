import React, { Fragment, useState, useEffect, forwardRef } from "react";
import moment from "moment";
import {
  formItemLayout,
  dataFormats,
  numTypes,
  standDataTypes,
} from "../../config";
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

function SubField({ value: subFields = [], onChange }, ref) {
  /**
   * 添加子字段
   */
  function handleItemAdd() {
    onChange([...subFields, {}]);
  }

  /**
   * 删除子字段
   * @param {Number} index
   */
  function handleItemRemove(index) {
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
  function handleItemChange(index, key, value) {
    const newSubFields = [...subFields];
    newSubFields[index] = { ...newSubFields[index], [key]: value };
    onChange(newSubFields);
  }

  return (
    <div ref={ref}>
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
              onChange={value => {
                handleItemChange(index, "type", value);
              }}
            >
              {standDataTypes.map(key => (
                <Option value={key} key={key}>
                  {key}
                </Option>
              ))}
            </Select>
            <Input
              style={{ width: "20%" }}
              placeholder="Key"
              value={item.key}
              onChange={e => {
                handleItemChange(index, "key", e.target.value);
              }}
            />
            <Input
              style={{ width: "20%" }}
              placeholder="Description"
              value={item.description}
              onChange={e => {
                handleItemChange(index, "description", e.target.value);
              }}
            />
            {item.type === "integer" || item.type === "number" ? (
              <InputNumber
                style={{ width: "40%" }}
                placeholder="Example"
                value={item.example}
                onChange={value => {
                  handleItemChange(index, "example", value);
                }}
              />
            ) : (
              <Input
                style={{ width: "40%" }}
                placeholder="Example"
                value={item.example}
                onChange={e => {
                  handleItemChange(index, "example", e.target.value);
                }}
              />
            )}
          </InputGroup>
          <Icon
            style={{
              position: "absolute",
              right: -20,
              top: 12,
            }}
            type="minus-circle-o"
            onClick={() => {
              handleItemRemove(index);
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
        onClick={handleItemAdd}
        icon="plus"
      >
        Add field
      </Button>
    </div>
  );
}

// https://ant.design/components/form-cn/#components-form-demo-customized-form-controls
// https://reactjs.org/docs/forwarding-refs.html
export default forwardRef(SubField);
