import React, { Fragment, useState } from "react";
import { formItemLayout, associationTypes } from "../../config";
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

function AssociationEdit({
  children,
  title = "编辑",
  formMode,
  dispatch,
  state,
  association,
  dataIndex,
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
      setVisible(false);
    });
  }

  function updateData(values) {
    const associations = state["x-associations"];
    if (formMode === "edit") {
      associations[dataIndex] = values;
    } else if (formMode === "create") {
      associations.push(values);
    }
    dispatch({
      type: "DATA_UPDATE",
      payload: {
        "x-associations": [...associations],
      },
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
          <Form.Item label="Source">
            {getFieldDecorator("source", {
              initialValue: association.source,
              rules: [
                {
                  required: true,
                  message: "请选择!",
                },
              ],
            })(
              <Select placeholder="请选择">
                {models.map(({ key, description }) => (
                  <Option value={key} key={key}>
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

          <Form.Item label="Type">
            {getFieldDecorator(`type`, {
              initialValue: association.type,
              rules: [
                {
                  required: true,
                  message: "请选择!",
                },
              ],
            })(
              <Radio.Group>
                {Object.keys(associationTypes).map(key => (
                  <Radio value={key} key={key}>
                    {key}
                  </Radio>
                ))}
              </Radio.Group>
            )}
          </Form.Item>

          <Form.Item label="Target">
            {getFieldDecorator("target", {
              initialValue: association.target,
              rules: [
                {
                  required: true,
                  message: "请选择!",
                },
              ],
            })(
              <Select placeholder="请选择">
                {models.map(({ key, description }) => (
                  <Option value={key} key={key}>
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

          <Form.Item label="As" hasFeedback>
            {getFieldDecorator(`as`, {
              initialValue: association.as,
              rules: [
                {
                  required: true,
                  message: "请填写!",
                },
              ],
            })(<Input placeholder="请填写" />)}
          </Form.Item>

          <Form.Item label="ForeignKey" hasFeedback>
            {getFieldDecorator(`foreignKey`, {
              initialValue: association.foreignKey,
              rules: [
                {
                  required: true,
                  message: "请填写!",
                },
              ],
            })(<Input placeholder="请填写" />)}
          </Form.Item>

          {(getFieldValue(`type`) === "hasOne" ||
            getFieldValue(`type`) === "hasMany") && (
            <Fragment>
              <Form.Item label="SourceKey" hasFeedback>
                {getFieldDecorator(`sourceKey`, {
                  initialValue: association.sourceKey,
                  rules: [
                    {
                      required: true,
                      message: "请填写!",
                    },
                  ],
                })(<Input placeholder="请填写" />)}
              </Form.Item>
            </Fragment>
          )}
          {getFieldValue(`type`) === "belongsTo" && (
            <Fragment>
              <Form.Item label="TargetKey" hasFeedback>
                {getFieldDecorator(`targetKey`, {
                  initialValue: association.targetKey,
                  rules: [
                    {
                      required: true,
                      message: "请填写!",
                    },
                  ],
                })(<Input placeholder="请填写" />)}
              </Form.Item>
            </Fragment>
          )}
          {getFieldValue(`type`) === "belongsToMany" && (
            <Fragment>
              <Form.Item label="ThroughModel">
                {getFieldDecorator("throughModel", {
                  initialValue: !!association.throughModel,
                  valuePropName: "checked",
                  rules: [
                    {
                      required: true,
                      message: "请选择!",
                    },
                  ],
                })(<Switch checkedChildren="是" unCheckedChildren="否" />)}
              </Form.Item>
              {getFieldValue("throughModel") ? (
                <Form.Item label="Through">
                  {getFieldDecorator("through", {
                    initialValue: association.through,
                    rules: [
                      {
                        required: true,
                        message: "请选择!",
                      },
                    ],
                  })(
                    <Select placeholder="请选择">
                      {models.map(({ key, description }) => (
                        <Option value={key} key={key}>
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
              ) : (
                <Form.Item label="Through" hasFeedback>
                  {getFieldDecorator(`through`, {
                    initialValue: association.through,
                    rules: [
                      {
                        required: true,
                        message: "请填写!",
                      },
                    ],
                  })(<Input placeholder="请填写" />)}
                </Form.Item>
              )}
              <Form.Item label="OtherKey" hasFeedback>
                {getFieldDecorator(`otherKey`, {
                  initialValue: association.otherKey,
                  rules: [
                    {
                      required: true,
                      message: "请填写!",
                    },
                  ],
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

export default Form.create({ name: "associationEdit" })(AssociationEdit);
