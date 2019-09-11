import React, { Fragment, useState } from "react";
import {
  formItemLayout,
  apiOptions,
} from "../../config";
import {
  Form,
  Input,
  Checkbox,
  Button,
  Drawer,
  Switch,
  Row,
} from "antd";

function ModelEdit({
  children,
  title = "编辑",
  formMode,
  dispatch,
  models,
  model,
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
    const { key: _, ...oldData } = model;
    dispatch({
      type: "MODEL_UPDATE",
      payload: {
        [key]: {
          ...oldData,
          ...newData,
        },
      },
    });
  }

  function handleModelKeyValidator(rule, value, callback) {
    if (models.map(item => item.key).includes(value) && formMode === "create") {
      callback("模型名称重复");
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
          <Form.Item label="模型名" hasFeedback>
            {getFieldDecorator("key", {
              initialValue: model.key,
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
          <Form.Item label="描述" hasFeedback>
            {getFieldDecorator("description", {
              initialValue: model.description,
              rules: [
                {
                  required: true,
                  message: "请填写!",
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="是否实体" required>
            {getFieldDecorator("x-isModel", {
              initialValue: !!model["x-isModel"],
              valuePropName: "checked",
            })(<Switch checkedChildren="是" unCheckedChildren="否" />)}
          </Form.Item>
          {getFieldValue("x-isModel") && (
            <Fragment>
              <Form.Item label="复数形式" hasFeedback>
                {getFieldDecorator("x-plural", {
                  initialValue: model["x-plural"],
                  rules: [
                    {
                      required: true,
                      message: "请填写!",
                    },
                  ],
                })(<Input />)}
              </Form.Item>
              <Form.Item label="表名" hasFeedback>
                {getFieldDecorator("x-tableName", {
                  initialValue: model["x-tableName"],
                  rules: [
                    {
                      required: true,
                      message: "请填写!",
                    },
                  ],
                })(<Input />)}
              </Form.Item>
              <Form.Item label="接口选项">
                {getFieldDecorator("x-apis", {
                  initialValue: model["x-apis"],
                })(
                  <Checkbox.Group>
                    {apiOptions.map(({ key, method, notice, path, plural }) => (
                      <Row key={key}>
                        <Checkbox value={key}>{`${method}("/${
                          plural
                            ? (getFieldValue("x-plural") || "").toLowerCase()
                            : (getFieldValue("key") || "").toLowerCase()
                        }${path}") ${notice}(${key})`}</Checkbox>
                      </Row>
                    ))}
                  </Checkbox.Group>
                )}
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

export default Form.create({ name: "modelEdit" })(ModelEdit);
