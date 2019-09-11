import React, { Fragment, useState } from "react";
import {
  formItemLayout,
} from "../../config";
import {
  Form,
  Input,
  Icon,
  Button,
  Drawer,
  Switch,
  Row,
  Col,
} from "antd";

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
      handleHide();
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
    if (models.map(item => item.key).includes(value)) {
      callback("模型名称重复");
    }
    callback();
  }

  function handlePluralValidator(rule, value, callback) {
    if (
      models
        .map(item => item["x-plural"])
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
        .map(item => item["x-tableName"])
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
          <Form.Item label="模型名">
            <Row gutter={8}>
              <Col span={11}>
                <Input value={model.key} disabled />
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
                      validator: handleModelKeyValidator,
                    },
                  ],
                })(<Input placeholder="请填写新模型名" />)}
              </Col>
            </Row>
          </Form.Item>

          <Form.Item label="描述">
            <Row gutter={8}>
              <Col span={11}>
                <Input value={model.description} disabled />
              </Col>
              <Col span={2} style={{ textAlign: "center" }}>
                <Icon type="arrow-right" />
              </Col>
              <Col span={11}>
                {getFieldDecorator("description", {
                  rules: [
                    {
                      required: true,
                      message: "请填写!",
                    },
                  ],
                })(<Input placeholder="请填写新描述" />)}
              </Col>
            </Row>
          </Form.Item>

          <Form.Item label="是否实体">
            <Switch
              checkedChildren="是"
              unCheckedChildren="否"
              checked={!!model["x-isModel"]}
              disabled
            />
          </Form.Item>

          {model["x-isModel"] && (
            <Fragment>
              <Form.Item label="复数形式">
                <Row gutter={8}>
                  <Col span={11}>
                    <Input value={model["x-plural"]} disabled />
                  </Col>
                  <Col span={2} style={{ textAlign: "center" }}>
                    <Icon type="arrow-right" />
                  </Col>
                  <Col span={11}>
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
                    })(<Input placeholder="请填写新复数形式" />)}
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item label="表名">
                <Row gutter={8}>
                  <Col span={11}>
                    <Input value={model["x-tableName"]} disabled />
                  </Col>
                  <Col span={2} style={{ textAlign: "center" }}>
                    <Icon type="arrow-right" />
                  </Col>
                  <Col span={11}>
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
                    })(<Input placeholder="请填写新表名" />)}
                  </Col>
                </Row>
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
