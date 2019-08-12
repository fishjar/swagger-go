import React, { Fragment, useState, useEffect } from "react";
import moment from "moment";
import {
  formItemLayout,
  apiOptions,
  dataFormats,
  numTypes,
  propTypes,
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
  Row,
  Col,
} from "antd";
const { Panel } = Collapse;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;
const InputGroup = Input.Group;
const { TextArea } = Input;

function ModelCopy({
  children,
  title = "编辑",
  formMode,
  dispatch,
  models,
  model,
  form,
}) {
  const { getFieldDecorator, getFieldValue, resetFields } = form;
  const { key: modelKey, data: modelData = {} } = model;

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
        message.error("表单填写有问题？");
        return;
      }
      console.log(values);
      updateData(values);
      handleHide();
    });
  }

  function updateData({ key, ...data }) {
    dispatch({
      type: "MODEL_UPDATE",
      payload: {
        [key]: {
          ...modelData,
          ...data,
        },
      },
    });
  }

  function handleModelKeyValidator(rule, value, callback) {
    if (models.map(item => item.key).includes(value)) {
      callback("模型名称重复");
    }
    callback();
  }

  function handlePluralValidator(rule, value, callback) {
    if (
      models
        .map(item => item.data["x-plural"])
        .filter(item => item)
        .includes(value)
    ) {
      callback("复数形式重复");
    }
    callback();
  }

  function handleTableNameValidator(rule, value, callback) {
    if (
      models
        .map(item => item.data["x-tableName"])
        .filter(item => item)
        .includes(value)
    ) {
      callback("表名重复");
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
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <Form {...formItemLayout} onSubmit={handleSubmit}>
          <Form.Item label="旧模型名">{modelKey}</Form.Item>
          <Form.Item label="新模型名" hasFeedback>
            {getFieldDecorator("key", {
              rules: [
                {
                  required: true,
                  message: "请填写!",
                },
                {
                  validator: handleModelKeyValidator,
                },
              ],
            })(<Input disabled={formMode === "edit"} />)}
          </Form.Item>

          <Form.Item label="旧描述">{modelData.description}</Form.Item>
          <Form.Item label="新描述" hasFeedback>
            {getFieldDecorator("description", {
              rules: [
                {
                  required: true,
                  message: "请填写!",
                },
              ],
            })(<Input />)}
          </Form.Item>

          <Form.Item label="是否实体">
            <Switch
              checkedChildren="是"
              unCheckedChildren="否"
              checked={!!modelData["x-isModel"]}
              disabled
            />
          </Form.Item>

          {modelData["x-isModel"] && (
            <Fragment>
              <Form.Item label="旧复数形式">{modelData["x-plural"]}</Form.Item>
              <Form.Item label="新复数形式" hasFeedback>
                {getFieldDecorator("x-plural", {
                  rules: [
                    {
                      required: true,
                      message: "请填写!",
                    },
                    {
                      validator: handlePluralValidator,
                    },
                  ],
                })(<Input />)}
              </Form.Item>

              <Form.Item label="旧表名">{modelData["x-tableName"]}</Form.Item>
              <Form.Item label="新表名" hasFeedback>
                {getFieldDecorator("x-tableName", {
                  rules: [
                    {
                      required: true,
                      message: "请填写!",
                    },
                    {
                      validator: handleTableNameValidator,
                    },
                  ],
                })(<Input />)}
              </Form.Item>
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

export default Form.create({ name: "modelCopy" })(ModelCopy);
