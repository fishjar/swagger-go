import React, { Fragment, useState, useEffect } from "react";
import { formItemLayout } from "../config";
import { Form, Input, Checkbox, Card, Icon, Button, Radio, Modal } from "antd";
const CheckboxGroup = Checkbox.Group;

export default function SecurityAddModal({
  state: { securityDefinitions },
  dispatch,
  visible,
  setModalVisible,
}) {
  const [key, setKey] = useState("");
  const [validateStatus, setValidateStatus] = useState("success");
  const [help, setHelp] = useState("");

  useEffect(() => {
    if (!key) {
      setValidateStatus("error");
      setHelp(`不能为空`);
    } else if (key in securityDefinitions) {
      setValidateStatus("error");
      setHelp(`${key} 已存在`);
    } else {
      setValidateStatus("success");
      setHelp("");
    }
  }, [key, securityDefinitions]);

  function handlerOk() {
    dispatch({
      type: "DATA_UPDATE",
      payload: {
        securityDefinitions: {
          ...securityDefinitions,
          [key]: {
            type: "basic",
          },
        },
      },
    });
    setModalVisible(false);
    setKey("");
  }

  return (
    <Modal
      visible={visible}
      title="Create a new security"
      onOk={handlerOk}
      onCancel={() => {
        setModalVisible(false);
        setKey("");
      }}
      okButtonProps={{ disabled: validateStatus !== "success" }}
    >
      <Form {...formItemLayout}>
        <Form.Item
          label="securityKey"
          help={help}
          validateStatus={validateStatus}
        >
          <Input
            placeholder="JWT"
            value={key}
            onChange={e => {
              setKey(e.target.value);
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
