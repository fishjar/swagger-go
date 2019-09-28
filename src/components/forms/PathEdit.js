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
      updateData(values);
    });
  }

  function updateData({ path, method, ...values }) {
    const paths = state["paths"];
    if (formMode === "create") {
      if (paths[path] && paths[path][method]) {
        message.error(`[${method}] ${path} 已存在`);
        return;
      }

      const modelPaths = [];
      models.forEach(model => {
        (model["x-apis"] || []).forEach(apiKey => {
          const api = apiOptions.find(item => item.key === apiKey);
          modelPaths.push({
            path: `/${
              api.plural
                ? (model["x-plural"] || "").toLowerCase()
                : model.key.toLowerCase()
            }${api.path}`,
            method: api.method,
          });
        });
      });
      if (
        modelPaths.find(item => item.path === path && item.method === method)
      ) {
        message.error(`[${method}] ${path} 与已定义的model冲突`);
        return;
      }

      if (!paths[path]) {
        paths[path] = {};
      }
    }
    paths[path][method] = filterObjectItemsNew(values);
    dispatch({
      type: "DATA_UPDATE",
      payload: { paths: { ...paths } },
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
          <Form.Item label="Path" hasFeedback>
            {getFieldDecorator(`path`, {
              initialValue: data.path,
              rules: [{ required: true, message: "请填写!" }],
            })(<Input placeholder="请填写" disabled={formMode === "edit"} />)}
          </Form.Item>
          <Form.Item label="Method">
            {getFieldDecorator(`method`, {
              initialValue: data.method,
              rules: [{ required: true, message: "请选择!" }],
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
          <Form.Item label="Security">
            {getFieldDecorator(`security`, {
              initialValue: data.security,
            })(
              <SecuritySelect securityDefinitions={state.securityDefinitions} />
            )}
          </Form.Item>
          <Form.Item label="Summary" hasFeedback>
            {getFieldDecorator(`summary`, {
              initialValue: data.summary,
              rules: [{ required: true, message: "请填写!" }],
            })(<Input placeholder="请填写" />)}
          </Form.Item>
          <Form.Item label="Description" hasFeedback>
            {getFieldDecorator(`description`, {
              initialValue: data.description,
            })(<Input placeholder="请填写" />)}
          </Form.Item>
          <Form.Item label="OperationId" hasFeedback>
            {getFieldDecorator(`operationId`, {
              initialValue: data.operationId,
            })(<Input placeholder="请填写" />)}
          </Form.Item>
          <Form.Item label="Responses">
            {getFieldDecorator(`responses`, {
              initialValue: data.responses,
            })(<PathResponses state={state} />)}
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

export default Form.create({ name: "pathEdit" })(PathEdit);
