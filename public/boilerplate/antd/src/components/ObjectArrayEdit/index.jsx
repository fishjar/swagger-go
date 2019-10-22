import React, { useState, forwardRef } from 'react';
import { Card, Button, Input, Icon, InputNumber, Form } from 'antd';

const formLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 15 },
};

function ObjectArrayEdit({ value, fieldsDefine = {}, onChange }, ref) {
  const list = value || [];
  const fields = Object.entries(fieldsDefine).map(([key, val]) => ({
    ...val,
    key,
  }));

  /**
   * 添加子字段
   */
  function handleItemAdd() {
    onChange([...list, {}]);
  }

  /**
   * 删除子字段
   * @param {Number} index
   */
  function handleItemRemove(index) {
    const newList = [...list];
    newList.splice(index, 1);
    onChange(newList);
  }

  /**
   * 修改子字段
   * @param {Number} index
   * @param {*} key
   * @param {*} value
   */
  function handleItemChange(index, key, value) {
    const newList = [...list];
    newList[index] = { ...newList[index], [key]: value };
    onChange(newList);
  }

  return (
    <div ref={ref}>
      {list.map((item, index) => (
        <Card
          key={index}
          style={{
            position: 'relative',
            marginBottom: 12,
          }}
        >
          {fields.map(field => {
            if (field.type === 'number') {
              return (
                <Form.Item {...formLayout} key={field.key} label={field.description}>
                  <InputNumber
                    defaultValue={item[field.key]}
                    onChange={val => {
                      handleItemChange(index, field.key, val);
                    }}
                  />
                </Form.Item>
              );
            }
            return (
              <Form.Item {...formLayout} key={field.key} label={field.description}>
                <Input
                  defaultValue={item[field.key]}
                  onChange={e => {
                    handleItemChange(index, field.key, e.target.value);
                  }}
                />
              </Form.Item>
            );
          })}
          <Icon
            style={{
              position: 'absolute',
              right: -20,
              top: 12,
            }}
            type="minus-circle-o"
            onClick={() => {
              handleItemRemove(index);
            }}
          />
        </Card>
      ))}
      <Button style={{ width: '100%' }} type="dashed" onClick={handleItemAdd} icon="plus">
        Add field
      </Button>
    </div>
  );
}

// https://ant.design/components/form-cn/#components-form-demo-customized-form-controls
// https://reactjs.org/docs/forwarding-refs.html
export default forwardRef(ObjectArrayEdit);
