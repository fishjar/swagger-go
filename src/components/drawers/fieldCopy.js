import React, { Fragment, useState, useEffect } from "react";
import moment from "moment";
import { formItemLayout, dataFormats, numTypes, propTypes } from "../../config";
import { getModelProps, deepClone } from "../../utils";
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
} from "antd";
const { Panel } = Collapse;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;
const InputGroup = Input.Group;
const { TextArea } = Input;

export default function FieldCopy({
  children,
  title = "编辑",
  formMode,
  dispatch,
  models,
  model,
  fields,
  field: defaultData,
}) {
  /**
   * 设置state hooks
   */
  const [visible, setVisible] = useState(false); // 抽屉是否可见
  const [validateStatus, setValidateStatus] = useState("success");
  const [help, setHelp] = useState("");
  const [newKey, setNewKey] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newXDescription, setNewXDescription] = useState("");

  /**
   * 副作用
   * 枚举类型时描述更新
   */
  useEffect(() => {
    if (defaultData["x-isEnum"]) {
      let description = newXDescription;
      Object.keys(defaultData["x-enumMap"]).forEach(key => {
        description += `\n  * ${key} - ${defaultData["x-enumMap"][key] || ""}`;
      });
      setNewDescription(description);
    }
  }, [newXDescription]);

  /**
   * 副作用
   * 检查key是否合法
   */
  useEffect(() => {
    (() => {
      if (newKey) {
        if (newKey === "key") {
          setValidateStatus("error");
          setHelp("字段名不能为key");
          return;
        }
        if (fields.map(item => item.key).includes(newKey)) {
          setValidateStatus("error");
          setHelp("字段重复");
          return;
        }
        setValidateStatus("success");
        setHelp("");
      }
    })();
  }, [newKey]);

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
  function handleShow() {
    setVisible(true);
  }

  /**
   * 重置表单
   */
  function handleReset() {
    setValidateStatus("success");
    setHelp("");
    setNewKey("");
    setNewDescription("");
    setNewXDescription("");
  }

  /**
   * 提交表单
   */
  function handleSubmit() {
    if (!newKey) {
      message.error("字段名称不能为空");
      return;
    }

    const { key: fieldKey, ...fieldData } = defaultData;
    const { key: modelKey, ...modelData } = model;

    const { required = [], example = {} } = modelData;
    fieldData["x-isRequired"] && required.push(newKey);
    fieldData["x-isExample"] &&
      (example[newKey] = fieldData.example || example[fieldKey]);

    const copyData = deepClone({
      ...fieldData,
      description: newDescription,
      "x-description": newXDescription,
    });

    dispatch({
      type: "MODEL_UPDATE",
      payload: {
        [modelKey]: {
          ...modelData,
          required,
          example,
          properties: {
            ...modelData.properties,
            [newKey]: copyData,
          },
        },
      },
    });
    handleHide();
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
      >
        <Form {...formItemLayout}>
          <Form.Item label="旧字段名">{defaultData.key}</Form.Item>
          <Form.Item
            label="新字段名"
            help={help}
            validateStatus={validateStatus}
          >
            <Input
              name="key"
              placeholder="请输入"
              value={newKey}
              onChange={e => {
                setNewKey(e.target.value);
              }}
            />
          </Form.Item>
          <Form.Item label="旧描述">
            {defaultData["x-isEnum"]
              ? defaultData["x-description"]
              : defaultData.description}
          </Form.Item>
          <Form.Item label="新描述">
            <Input
              name="key"
              placeholder="请输入"
              value={defaultData["x-isEnum"] ? newXDescription : newDescription}
              onChange={e => {
                defaultData["x-isEnum"]
                  ? setNewXDescription(e.target.value)
                  : setNewDescription(e.target.value);
              }}
            />
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
          <Button
            onClick={handleSubmit}
            type="primary"
            disabled={!newKey || validateStatus !== "success"}
          >
            Submit
          </Button>
        </div>
      </Drawer>
    </span>
  );
}
