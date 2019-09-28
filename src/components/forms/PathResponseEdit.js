import React, { Fragment, useState } from "react";
import { formItemLayout, standDataTypes, httpMethods } from "../../config";
import SecuritySelect from "./SecuritySelect";
import PathResponses from "./PathResponses";
import SubFieldsObject from "./SubFieldsObject";
import {
  Form,
  Input,
  Checkbox,
  Button,
  Radio,
  Collapse,
  Drawer,
  Select,
  Switch,
} from "antd";
const { Option } = Select;

function PathResponseEdit({
  children,
  title = "编辑",
  formMode,
  state,
  data = {},
  onSubmit,
  form,
}) {
  const {
    getFieldDecorator,
    getFieldValue,
    resetFields,
    setFieldsValue,
  } = form;

  const models = Object.entries(state.definitions).map(([key, values]) => ({
    ...values,
    key,
  }));

  /**
   * 设置state hooks
   */
  const [visible, setVisible] = useState(false); // 抽屉是否可见
  const schemaType =
    data.schema && (data.schema.$ref ? "ref" : data.schema.type);

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
  function handleShow(e) {
    e.stopPropagation();
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
      const {
        hasSchema,
        schemaType,
        schemaRef,
        schemaItemsRef,
        schemaProperties,
        ...data
      } = values;
      if (!hasSchema) {
        onSubmit(data);
      } else if (schemaType === "ref") {
        onSubmit({ ...data, schema: { type: schemaType, $ref: schemaRef } });
      } else if (schemaType === "array") {
        onSubmit({
          ...data,
          schema: { type: schemaType, items: { $ref: schemaItemsRef } },
        });
      } else if (schemaType === "object") {
        onSubmit({
          ...data,
          schema: { type: schemaType, properties: schemaProperties },
        });
      } else {
        onSubmit({ ...data, schema: { type: schemaType } });
      }
      setVisible(false);
    });
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
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <Form {...formItemLayout} onSubmit={handleSubmit}>
          <Form.Item label="Response" hasFeedback>
            {getFieldDecorator(`key`, {
              initialValue: data.key,
              rules: [{ required: true, message: "请填写!" }],
            })(<Input placeholder="请填写" disabled={formMode === "edit"} />)}
          </Form.Item>
          <Form.Item label="Description" hasFeedback>
            {getFieldDecorator(`description`, {
              initialValue: data.description,
              rules: [{ required: true, message: "请填写!" }],
            })(<Input placeholder="请填写" />)}
          </Form.Item>
          <Form.Item label="HasSchema">
            {getFieldDecorator(`hasSchema`, {
              initialValue: !!data.schema,
              valuePropName: "checked",
            })(<Switch />)}
          </Form.Item>
          {getFieldValue("hasSchema") && (
            <Fragment>
              <Form.Item label="schemaType">
                {getFieldDecorator("schemaType", {
                  initialValue: schemaType,
                  rules: [{ required: true, message: "请选择!" }],
                })(
                  <Select
                    placeholder="请选择"
                    showSearch
                    optionFilterProp="children"
                  >
                    <Option value="ref">ref</Option>
                    {standDataTypes.map(item => (
                      <Option value={item} key={item}>
                        {item}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              {getFieldValue("schemaType") === "ref" && (
                <Form.Item label="选择模型">
                  {getFieldDecorator("schemaRef", {
                    initialValue: data.schema && data.schema.$ref,
                    rules: [{ required: true, message: "请选择!" }],
                  })(
                    <Select placeholder="请选择">
                      {models.map(({ key, description }) => (
                        <Option value={`#/definitions/${key}`} key={key}>
                          <span>{`#/definitions/${key}`}</span>
                          <span
                            style={{
                              color: "#999",
                            }}
                          >{` (${description})`}</span>
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              )}
              {getFieldValue("schemaType") === "array" && (
                <Form.Item label="选择数组模型">
                  {getFieldDecorator("schemaItemsRef", {
                    initialValue:
                      data.schema &&
                      data.schema.items &&
                      data.schema.items.$ref,
                    rules: [{ required: true, message: "请选择!" }],
                  })(
                    <Select placeholder="请选择">
                      {models.map(({ key, description }) => (
                        <Option value={`#/definitions/${key}`} key={key}>
                          <span>{`#/definitions/${key}`}</span>
                          <span
                            style={{
                              color: "#999",
                            }}
                          >{` (${description})`}</span>
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              )}
              {getFieldValue("schemaType") === "object" && (
                <Form.Item label="字段选项">
                  {getFieldDecorator("schemaProperties", {
                    initialValue: data.schema && data.schema.properties,
                  })(<SubFieldsObject />)}
                </Form.Item>
              )}
            </Fragment>
          )}
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

export default Form.create({ name: "pathResponseEdit" })(PathResponseEdit);
