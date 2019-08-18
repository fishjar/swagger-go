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
  const [securityDefinitions, setSecurityDefinitions] = useState(
    Object.entries((state && state.securityDefinitions) || {}).map(
      ([key, values]) => ({
        ...values,
        key,
      })
    )
  );

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
    setSecurityDefinitions(
      Object.entries((state && state.securityDefinitions) || {}).map(
        ([key, values]) => ({
          ...values,
          key,
        })
      )
    );
  }

  /**
   * 提交表单
   */
  function handleSubmit(e) {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        // message.error("表单填写有问题？");
        return;
      }
      console.log(values);
      // updateData(values);
      // setVisible(false);
    });
  }

  function updateData({ key, ...newData }) {
    // const { key: _, ...oldData } = model;
    // dispatch({
    //   type: "MODEL_UPDATE",
    //   payload: {
    //     [key]: {
    //       ...oldData,
    //       ...newData,
    //     },
    //   },
    // });
  }

  // function handleModelKeyValidator(rule, value, callback) {
  //   if (models.map(item => item.key).includes(value) && formMode === "create") {
  //     callback("模型名称重复");
  //   }
  //   callback();
  // }

  function handleRemoveSecurity(index) {
    // const newData = [...securityDefinitions];
    const newData = [...getFieldValue("securityDefinitions")];
    newData.splice(index, 1);
    setSecurityDefinitions(newData);
  }

  function handleAddSecurity() {
    const newData = [...getFieldValue("securityDefinitions"), {}];
    setSecurityDefinitions(newData);
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
            {getFieldDecorator("into.title", {
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
            {getFieldDecorator("into.version", {
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
            {getFieldDecorator("into.description", {
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
          <Form.Item label="security">
            {securityDefinitions.map((item, index) => (
              <Card
                key={index}
                style={{ marginBottom: 16, position: "relative" }}
              >
                <Form.Item {...formItemLayout} label="security">
                  {getFieldDecorator(`securityDefinitions[${index}].key`, {
                    initialValue: item.key,
                    rules: [
                      {
                        required: true,
                        message: "请填写!",
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
                <Form.Item {...formItemLayout} label="type">
                  {getFieldDecorator(`securityDefinitions[${index}].type`, {
                    initialValue: item.type,
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
                        oauth2
                      </Radio>
                    </Radio.Group>
                  )}
                </Form.Item>

                {getFieldValue(`securityDefinitions[${index}].type`) ===
                  "apiKey" && (
                  <Fragment>
                    <Form.Item {...formItemLayout} label="name">
                      {getFieldDecorator(`securityDefinitions[${index}].name`, {
                        initialValue: item.name,
                        rules: [
                          {
                            required: true,
                            message: "请填写!",
                          },
                        ],
                      })(<Input />)}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="in">
                      {getFieldDecorator(`securityDefinitions[${index}].in`, {
                        initialValue: item.in,
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
                    <Form.Item {...formItemLayout} label="description">
                      {getFieldDecorator(
                        `securityDefinitions[${index}].description`,
                        {
                          initialValue: item.description,
                        }
                      )(<Input />)}
                    </Form.Item>
                  </Fragment>
                )}

                <Icon
                  className="dynamic-delete-button"
                  type="minus-circle-o"
                  onClick={() => {
                    handleRemoveSecurity(index);
                  }}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: -20,
                  }}
                />
              </Card>
            ))}
            <Button
              type="dashed"
              style={{ width: "100%" }}
              onClick={handleAddSecurity}
            >
              <Icon type="plus" /> Add field
            </Button>
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
