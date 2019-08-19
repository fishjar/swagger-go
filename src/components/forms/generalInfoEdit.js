import React, { Fragment, useState, useEffect } from "react";
import moment from "moment";
import {
  formItemLayout,
  apiOptions,
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
  Row,
  Col,
} from "antd";
const { Panel } = Collapse;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;
const InputGroup = Input.Group;
const { TextArea } = Input;

function GeneralInfoEdit({ children, title = "编辑", dispatch, state, form }) {
  const {
    getFieldDecorator,
    getFieldValue,
    resetFields,
    setFieldsValue,
  } = form;

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
      setVisible(false);
    });
  }

  function updateData(values) {
    dispatch({
      type: "DATA_UPDATE",
      payload: values,
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
          <Form.Item label="swagger版本" hasFeedback>
            {getFieldDecorator("swagger", {
              initialValue: state.swagger,
              rules: [
                {
                  required: true,
                  message: "请填写!",
                },
              ],
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item label="文档标题" hasFeedback>
            {getFieldDecorator("info.title", {
              initialValue: state.info.title,
              rules: [
                {
                  required: true,
                  message: "请填写!",
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="文档版本" hasFeedback>
            {getFieldDecorator("info.version", {
              initialValue: state.info.version,
              rules: [
                {
                  required: true,
                  message: "请填写!",
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="文档描述" hasFeedback>
            {getFieldDecorator("info.description", {
              initialValue: state.info.description,
              rules: [
                {
                  required: true,
                  message: "请填写!",
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="schemes">
            {getFieldDecorator("schemes", {
              initialValue: state.schemes,
              rules: [
                {
                  required: true,
                  message: "请填写!",
                },
              ],
            })(<CheckboxGroup options={["http", "https"]} />)}
          </Form.Item>
          <Form.Item label="host" hasFeedback>
            {getFieldDecorator("host", {
              initialValue: state.host,
              rules: [
                {
                  required: true,
                  message: "请填写!",
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="basePath" hasFeedback>
            {getFieldDecorator("basePath", {
              initialValue: state.basePath,
              rules: [
                {
                  required: true,
                  message: "请填写!",
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="consumes">
            {getFieldDecorator("consumes", {
              initialValue: state.consumes,
              rules: [
                {
                  required: true,
                  message: "请选择!",
                },
              ],
            })(
              <CheckboxGroup
                options={["application/json", "application/xml"]}
              />
            )}
          </Form.Item>
          <Form.Item label="produces">
            {getFieldDecorator("produces", {
              initialValue: state.produces,
              rules: [
                {
                  required: true,
                  message: "请选择!",
                },
              ],
            })(
              <CheckboxGroup
                options={["application/json", "application/xml"]}
              />
            )}
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

export default Form.create({ name: "generalInfoEdit" })(GeneralInfoEdit);
