import React, { forwardRef, useState, useEffect } from "react";
import { standDataTypes } from "../../config";
import {
  parseRef,
  hasDuplication,
  parseArrayToObject,
  filterObjectItems,
  filterArrayItems2,
  getType,
  deepClone,
} from "../../utils";
import { Input, Icon, Button, Select } from "antd";
const { Option } = Select;
const InputGroup = Input.Group;

function SubFieldsObject({ value = {}, onChange }, ref) {
  const [fields, setFields] = useState(
    Object.entries(value).map(([key, val]) => ({
      ...val,
      key,
    }))
  );

  useEffect(handleChange, [fields]);

  /**
   * 添加子字段
   */
  function handleItemAdd() {
    setFields([...fields, {}]);
  }

  /**
   * 删除子字段
   * @param {Number} index
   */
  function handleItemRemove(index) {
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
  }

  /**
   * 修改子字段
   * @param {Number} index
   * @param {*} key
   * @param {*} value
   */
  function handleItemChange(index, key, value) {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], [key]: value };
    setFields(newFields);
  }

  function handleChange() {
    const newValue = parseArrayToObject(fields.filter(item => item.type));
    onChange(newValue);
  }

  return (
    <div ref={ref}>
      {fields.map((item, index) => (
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
              style={{ width: "40%" }}
              placeholder="Key"
              value={item.key}
              onChange={e => {
                handleItemChange(index, "key", e.target.value);
              }}
            />
            <Input
              style={{ width: "40%" }}
              placeholder="Description"
              value={item.description}
              onChange={e => {
                handleItemChange(index, "description", e.target.value);
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
export default forwardRef(SubFieldsObject);
