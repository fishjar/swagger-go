import React, { Fragment, useState, useEffect } from "react";
import moment from "moment";
import { formItemLayout, dataFormats, numTypes, standDataTypes } from "../../config";
import { getModelProps, deepClone } from "../../utils";
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

function FieldCopy({
  children,
  title = "编辑",
  formMode,
  dispatch,
  models,
  model,
  fields,
  field,
  form,
}) {
  const { getFieldDecorator, getFieldValue, resetFields } = form;

  /**
   * 设置state hooks
   */
  const [visible, setVisible] = useState(false); // 抽屉是否可见

  /**
   * 关闭抽屉
   */
  function handleHide() {
    handleReset();
    setVisible(false);
  }

  /**
   * 打开抽屉
   */
  function handleShow() {
    setVisible(true);
  }

  /**
   * 重置表单
   */
  function handleReset() {
    resetFields();
  }

  /**
   * 提交表单
   */
  function handleSubmit(e) {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        message.error("表单填写有问题？");
        return;
      }
      console.log(values);
      updateData(values);
      handleHide();
    });
  }

  function updateData({ key, ...newData }) {
    const { key: modelKey, ...modelData } = model;
    const { key: fieldKey, ...oldData } = field;
    const { properties = {}, required = [], example = {} } = modelData;

    oldData["x-isRequired"] && required.push(key);
    oldData["x-isExample"] &&
      (example[key] = oldData.example || example[fieldKey]);

    const copyData = deepClone({
      ...oldData,
      ...newData,
    });

    dispatch({
      type: "MODEL_UPDATE",
      payload: {
        [modelKey]: {
          ...modelData,
          required,
          example,
          properties: {
            ...properties,
            [key]: copyData,
          },
        },
      },
    });
  }

  function handleFieldKeyValidator(rule, value, callback) {
    if (fields.map(item => item.key).includes(value)) {
      callback("字段名称重复");
    }
    callback();
  }

  return (
    <span>
      <span
        onClick={handleShow}
        style={{
          cursor: "pointer",
        }}
      >
        {children}
      </span>
      <Drawer
        destroyOnClose
        title={title}
        width="60%"
        onClose={handleHide}
        visible={visible}
      >
        <Form {...formItemLayout} onSubmit={handleSubmit}>
          <Form.Item label="旧字段名">{field.key}</Form.Item>
          <Form.Item label="新字段名" hasFeedback>
            {getFieldDecorator("key", {
              rules: [
                {
                  required: true,
                  message: "请填写!",
                },
                {
                  validator: handleFieldKeyValidator,
                },
              ],
            })(<Input disabled={formMode === "edit"} />)}
          </Form.Item>

          <Form.Item label="旧描述">
            {field["x-isEnum"] ? field["x-description"] : field.description}
          </Form.Item>
          <Form.Item label="新描述" hasFeedback>
            {getFieldDecorator(
              field["x-isEnum"] ? "x-description" : "description",
              {
                rules: [
                  {
                    required: true,
                    message: "请填写!",
                  },
                ],
              }
            )(<Input />)}
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
          <Button onClick={handleReset} style={{ marginRight: 8 }}>
            Reset
          </Button>
          <Button onClick={handleSubmit} type="primary">
            Submit
          </Button>
        </div>
      </Drawer>
    </span>
  );
}

export default Form.create({ name: "fieldCopy" })(FieldCopy);
