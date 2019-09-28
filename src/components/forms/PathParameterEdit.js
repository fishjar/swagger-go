import React, { Fragment, useState } from "react";
import {
  formItemLayout,
  standDataTypes,
  httpMethods,
  parameterTypes,
} from "../../config";
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

function PathParameterEdit({
  children,
  title = "编辑",
  formMode,
  state,
  data = {},
  dataIndex,
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
        itemsType,
        schemaType,
        schemaRef,
        schemaItemsRef,
        schemaProperties,
        ...data
      } = values;
      if (!hasSchema) {
        if (data.type === "array") {
          onSubmit({ ...data, items: { type: itemsType } }, dataIndex);
        } else {
          onSubmit(data, dataIndex);
        }
      } else if (schemaType === "ref") {
        onSubmit({ ...data, schema: { $ref: schemaRef } }, dataIndex);
      } else if (schemaType === "array") {
        onSubmit(
          {
            ...data,
            schema: { type: schemaType, items: { $ref: schemaItemsRef } },
          },
          dataIndex
        );
      } else if (schemaType === "object") {
        onSubmit(
          {
            ...data,
            schema: { type: schemaType, properties: schemaProperties },
          },
          dataIndex
        );
      } else {
        onSubmit({ ...data, schema: { type: schemaType } }, dataIndex);
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
          <Form.Item label="In">
            {getFieldDecorator("in", {
              initialValue: data.in,
              rules: [{ required: true, message: "请选择!" }],
            })(
              <Select
                placeholder="请选择"
                showSearch
                optionFilterProp="children"
              >
                {parameterTypes.map(item => (
                  <Option value={item} key={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Name" hasFeedback>
            {getFieldDecorator(`name`, {
              initialValue: data.name,
              rules: [{ required: true, message: "请填写!" }],
            })(<Input placeholder="请填写" />)}
          </Form.Item>
          <Form.Item label="Description" hasFeedback>
            {getFieldDecorator(`description`, {
              initialValue: data.description,
              rules: [{ required: true, message: "请填写!" }],
            })(<Input placeholder="请填写" />)}
          </Form.Item>
          <Form.Item label="required">
            {getFieldDecorator(`required`, {
              initialValue: !!data.required,
              valuePropName: "checked",
            })(<Switch />)}
          </Form.Item>
          <Form.Item label="HasSchema">
            {getFieldDecorator(`hasSchema`, {
              initialValue: !!data.schema,
              valuePropName: "checked",
            })(<Switch />)}
          </Form.Item>
          {getFieldValue("hasSchema") ? (
            <Fragment>
              <Form.Item label="SchemaType">
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
                <Fragment>
                  <Form.Item label="数组类型">
                    {getFieldDecorator("schemaItemsType", {
                      initialValue:
                        data.schema &&
                        data.schema.items &&
                        data.schema.items.type,
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
                  <Form.Item label="数组模型">
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
                </Fragment>
              )}
              {getFieldValue("schemaType") === "object" && (
                <Form.Item label="字段选项">
                  {getFieldDecorator("schemaProperties", {
                    initialValue: data.schema && data.schema.properties,
                  })(<SubFieldsObject />)}
                </Form.Item>
              )}
            </Fragment>
          ) : (
            <Fragment>
              <Form.Item label="Type">
                {getFieldDecorator("type", {
                  initialValue: data.type,
                  rules: [{ required: true, message: "请选择!" }],
                })(
                  <Select
                    placeholder="请选择"
                    showSearch
                    optionFilterProp="children"
                  >
                    {standDataTypes.map(item => (
                      <Option value={item} key={item}>
                        {item}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              {getFieldValue("type") === "array" && (
                <Form.Item label="Item Type">
                  {getFieldDecorator("itemsType", {
                    initialValue: data.items && data.items.type,
                    rules: [{ required: true, message: "请选择!" }],
                  })(
                    <Select
                      placeholder="请选择"
                      showSearch
                      optionFilterProp="children"
                    >
                      {standDataTypes.map(item => (
                        <Option value={item} key={item}>
                          {item}
                        </Option>
                      ))}
                    </Select>
                  )}
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

export default Form.create({ name: "pathParameterEdit" })(PathParameterEdit);
