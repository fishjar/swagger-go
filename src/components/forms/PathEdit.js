import React, { Fragment, useState } from "react";
import { formItemLayout, associationTypes, httpMethods } from "../../config";
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

function PathEdit({
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
      // updateData(values);
      // setVisible(false);
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
          <Form.Item label="Path" hasFeedback>
            {getFieldDecorator(`path`, {
              initialValue: data.path,
              rules: [
                {
                  required: true,
                  message: "请填写!",
                },
              ],
            })(<Input placeholder="请填写" disabled={formMode === "edit"} />)}
          </Form.Item>
          <Form.Item label="Method">
            {getFieldDecorator(`method`, {
              initialValue: data.method,
              rules: [
                {
                  required: true,
                  message: "请选择!",
                },
              ],
            })(
              <Select placeholder="请选择" disabled={formMode === "edit"}>
                {httpMethods.map((item, index) => (
                  <Option key={index} value={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Tags">
            {getFieldDecorator("tags", {
              initialValue: data.tags || undefined,
            })(
              <Select mode="tags" tokenSeparators={[","]} placeholder="请选择">
                {tagsList.map((item, index) => (
                  <Option key={index} value={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>

          {/* <Form.Item label="Source">
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
          </Form.Item> */}
          {/* <Form.Item label="Type">
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
          </Form.Item> */}
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

export default Form.create({ name: "pathEdit" })(PathEdit);
