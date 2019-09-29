import React, { Fragment, useState } from "react";
import {
  formItemLayout,
  associationTypes,
  httpMethods,
  apiOptions,
} from "../../config";
import { filterObjectItemsNew } from "../../utils";
import SecuritySelect from "./SecuritySelect";
import PathResponses from "./PathResponses";
import PathParameters from "./PathParameters";
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
  message,
} from "antd";
const { Option } = Select;

function TagEdit({
  children,
  title = "编辑",
  formMode,
  dispatch,
  state,
  data,
  dataIndex,
  tagsList,
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
      updateData(values);
    });
  }

  function updateData(values) {
    const tags = [...state.tags];
    if (formMode === "edit") {
      tags[dataIndex] = values;
    } else if (formMode === "create") {
      if(tags.map(item=>item.name).includes(values.name)){
        message.error(`名称 ${values.name} 重复`);
        return;
      }
      tags.push(values);
    }
    dispatch({
      type: "DATA_UPDATE",
      payload: { tags },
    });
    setVisible(false);
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
          <Form.Item label="Name" hasFeedback>
            {getFieldDecorator(`name`, {
              initialValue: data.name,
              rules: [{ required: true, message: "请填写!" }],
            })(<Input placeholder="请填写" disabled={formMode === "edit"} />)}
          </Form.Item>
          <Form.Item label="Description" hasFeedback>
            {getFieldDecorator(`description`, {
              initialValue: data.description,
              rules: [{ required: true, message: "请填写!" }],
            })(<Input placeholder="请填写" />)}
          </Form.Item>
          <Form.Item label="ExternalDocs.description" hasFeedback>
            {getFieldDecorator(`externalDocs.description`, {
              initialValue: data.externalDocs && data.externalDocs.description,
            })(<Input placeholder="请填写" />)}
          </Form.Item>
          <Form.Item label="ExternalDocs.url" hasFeedback>
            {getFieldDecorator(`externalDocs.url`, {
              initialValue: data.externalDocs && data.externalDocs.url,
            })(<Input placeholder="请填写" />)}
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

export default Form.create({ name: "tagEdit" })(TagEdit);
