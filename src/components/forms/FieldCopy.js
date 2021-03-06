import React, { useState } from "react";
import { formItemLayout } from "../../config";
import { deepClone } from "../../utils";
import { Form, Input, Icon, Button, Drawer, Row, Col } from "antd";

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
  const { getFieldDecorator, resetFields } = form;

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
        return;
      }
      console.log(values);
      updateData(values);
      handleHide();
    });
  }

  function updateData({ key: newKey, ...newData }) {
    const { key: modelKey, ...modelData } = model;
    const { key: oldKey, ...oldData } = field;
    const { properties = {}, required = [], example = {} } = modelData;

    oldData.isRequired && required.push(newKey);
    oldData.isExample && (example[newKey] = oldData.example || example[oldKey]);

    if (oldData.isEnum) {
      newData.description = `"${newData["x-description"]}"`;
      oldData.enumItems.forEach(item => {
        newData.description += `\n  * ${item.key} - ${item.description}`;
      });
    }

    const copyData = deepClone({
      ...model.properties[oldKey],
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
            [newKey]: copyData,
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

  function handleFieldNameValidator(rule, value, callback) {
    if (fields.map(item => item["x-fieldName"]).includes(value)) {
      callback("数据库字段名称重复");
    }
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
          <Form.Item label="字段名">
            <Row gutter={8}>
              <Col span={11}>
                <Input value={field.key} disabled />
              </Col>
              <Col span={2} style={{ textAlign: "center" }}>
                <Icon type="arrow-right" />
              </Col>
              <Col span={11}>
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
                })(<Input placeholder="请填写新字段名" />)}
              </Col>
            </Row>
          </Form.Item>

          <Form.Item label="数据库字段名">
            <Row gutter={8}>
              <Col span={11}>
                <Input value={field["x-fieldName"] || field.key} disabled />
              </Col>
              <Col span={2} style={{ textAlign: "center" }}>
                <Icon type="arrow-right" />
              </Col>
              <Col span={11}>
                {getFieldDecorator("x-fieldName", {
                  rules: [
                    {
                      required: true,
                      message: "请填写!",
                    },
                    {
                      validator: handleFieldNameValidator,
                    },
                  ],
                })(<Input placeholder="请填写新字段名" />)}
              </Col>
            </Row>
          </Form.Item>

          <Form.Item label="描述">
            <Row gutter={8}>
              <Col span={11}>
                <Input
                  value={
                    field.isRef || field.isEnum
                      ? field["x-description"]
                      : field.description
                  }
                  disabled
                />
              </Col>
              <Col span={2} style={{ textAlign: "center" }}>
                <Icon type="arrow-right" />
              </Col>
              <Col span={11}>
                {getFieldDecorator(
                  field.isRef || field.isEnum ? "x-description" : "description",
                  {
                    rules: [
                      {
                        required: true,
                        message: "请填写!",
                      },
                    ],
                  }
                )(<Input placeholder="请填写新描述" />)}
              </Col>
            </Row>
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
