import React, { Fragment, useState } from "react";
import {
  formItemLayout,
} from "../../config";
import {
  Form,
  Input,
  Button,
  Radio,
  Drawer,
} from "antd";

function SecurityEdit({
  children,
  title = "编辑",
  formMode,
  dispatch,
  state,
  security,
  form,
}) {
  const {
    getFieldDecorator,
    getFieldValue,
    resetFields,
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

  function updateData({ key, ...newData }) {
    dispatch({
      type: "DATA_UPDATE",
      payload: {
        securityDefinitions: {
          ...state.securityDefinitions,
          [key]: newData,
        },
      },
    });
  }

  function handleSecurityKeyValidator(rule, value, callback) {
    if (
      Object.keys(state.securityDefinitions || {}).includes(value) &&
      formMode === "create"
    ) {
      callback("Security名称重复");
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
          <Form.Item label="security" hasFeedback>
            {getFieldDecorator(`key`, {
              initialValue: security.key,
              rules: [
                {
                  required: true,
                  message: "请填写!",
                },
                {
                  validator: handleSecurityKeyValidator,
                },
              ],
            })(<Input placeholder="请填写" disabled={formMode === "edit"} />)}
          </Form.Item>
          <Form.Item label="type">
            {getFieldDecorator(`type`, {
              initialValue: security.type,
              rules: [
                {
                  required: true,
                  message: "请选择!",
                },
              ],
            })(
              <Radio.Group>
                <Radio value={"basic"}>basic</Radio>
                <Radio value={"apiKey"}>apiKey</Radio>
                <Radio value={"oauth2"} disabled>
                  oauth2(暂不支持)
                </Radio>
              </Radio.Group>
            )}
          </Form.Item>

          {getFieldValue(`type`) === "apiKey" && (
            <Fragment>
              <Form.Item label="name" hasFeedback>
                {getFieldDecorator(`name`, {
                  initialValue: security.name,
                  rules: [
                    {
                      required: true,
                      message: "请填写!",
                    },
                  ],
                })(<Input placeholder="请填写" />)}
              </Form.Item>
              <Form.Item label="in">
                {getFieldDecorator(`in`, {
                  initialValue: security.in,
                  rules: [
                    {
                      required: true,
                      message: "请选择!",
                    },
                  ],
                })(
                  <Radio.Group>
                    <Radio value={"header"}>header</Radio>
                    <Radio value={"query"}>query</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
              <Form.Item label="description" hasFeedback>
                {getFieldDecorator(`description`, {
                  initialValue: security.description,
                })(<Input placeholder="请填写" />)}
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

export default Form.create({ name: "securityEdit" })(SecurityEdit);
