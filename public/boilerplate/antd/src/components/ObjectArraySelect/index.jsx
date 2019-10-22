import React, { useState, forwardRef } from 'react';
import { Card, Select, Button, Input, Icon, InputNumber, Form } from 'antd';
const { Option } = Select;

function ObjectArraySelect({ value, listData = [], onChange }, ref) {
  function handleChange(selectedIds) {
    if (onChange) {
      onChange(selectedIds.map(id => listData.find(item => item.id === id)));
    }
  }

  return (
    <Select
      ref={ref}
      mode="multiple"
      optionFilterProp="children"
      filterOption={(input, option) =>
        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      placeholder="请选择"
      defaultValue={value && value.map(item => item.id)}
      onChange={handleChange}
    >
      {listData.map(item => (
        <Option key={item.id} value={item.id}>
          {item.name}
        </Option>
      ))}
    </Select>
  );
}

// https://ant.design/components/form-cn/#components-form-demo-customized-form-controls
// https://reactjs.org/docs/forwarding-refs.html
export default forwardRef(ObjectArraySelect);
