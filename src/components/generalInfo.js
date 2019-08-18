import React, { Fragment, useState, useEffect } from "react";
// import SecurityAddModal from "./securityAddModal";
import { formItemLayout } from "../config";
import {
  Form,
  Input,
  Checkbox,
  Card,
  Icon,
  Button,
  Radio,
  Modal,
  Table,
} from "antd";
const CheckboxGroup = Checkbox.Group;

export default function GeneralInfo({ state, dispatch }) {
  const securityDefinitions = Object.entries(
    (state && state.securityDefinitions) || {}
  ).map(([key, values]) => ({
    ...values,
    key,
  }));
  const [modalVisible, setModalVisible] = useState(false);

  function handleInputChange(e) {
    const { name, value } = e.target;
    dispatch({
      type: "DATA_UPDATE",
      payload: { [name]: value },
    });
  }

  function handleInputInfoChange(e) {
    const { name, value } = e.target;
    dispatch({
      type: "DATA_UPDATE",
      payload: { info: { ...state.info, [name]: value } },
    });
  }

  function handleSecurityType(securityKey, securityType) {
    if (securityType === "basic") {
      dispatch({
        type: "DATA_UPDATE",
        payload: {
          securityDefinitions: {
            ...state.securityDefinitions,
            [securityKey]: { type: securityType },
          },
        },
      });
    } else if (securityType === "apiKey") {
      dispatch({
        type: "DATA_UPDATE",
        payload: {
          securityDefinitions: {
            ...state.securityDefinitions,
            [securityKey]: {
              type: securityType,
              in: "header",
              name: "X-Authorization",
              description: "X-Authorization: Bearer {token}",
            },
          },
        },
      });
    }
  }

  function handleSecurityChange(key, name, value) {
    dispatch({
      type: "DATA_UPDATE",
      payload: {
        securityDefinitions: {
          ...state.securityDefinitions,
          [key]: {
            ...state.securityDefinitions[key],
            [name]: value,
          },
        },
      },
    });
  }

  function handleRemoveSecurity(key) {
    const newSecurityDefinitions = { ...state.securityDefinitions };
    delete newSecurityDefinitions[key];
    dispatch({
      type: "DATA_UPDATE",
      payload: {
        securityDefinitions: newSecurityDefinitions,
      },
    });
  }

  return (
    <Fragment>
      <Form {...formItemLayout}>
        <Form.Item label="swagger">{state.swagger}</Form.Item>
        <Form.Item label="info.title">{state.info.title}</Form.Item>
        <Form.Item label="info.version">{state.info.version}</Form.Item>
        <Form.Item label="info.description">{state.info.description}</Form.Item>
        <Form.Item label="schemes">
          <CheckboxGroup
            options={["http", "https"]}
            value={state.schemes}
            disabled
          />
        </Form.Item>
        <Form.Item label="host">{state.host}</Form.Item>
        <Form.Item label="basePath">{state.basePath}</Form.Item>
        <Form.Item label="consumes">
          <CheckboxGroup
            options={["application/json", "application/xml"]}
            value={state.consumes}
            disabled
          />
        </Form.Item>
        <Form.Item label="produces">
          <CheckboxGroup
            options={["application/json", "application/xml"]}
            value={state.produces}
            disabled
          />
        </Form.Item>
        <Form.Item label="securityDefinitions">
          <Table
            columns={[
              {
                title: "security",
                dataIndex: "key",
              },
              {
                title: "type",
                dataIndex: "type",
              },
              {
                title: "in",
                dataIndex: "in",
              },
              {
                title: "name",
                dataIndex: "name",
              },
              {
                title: "description",
                dataIndex: "description",
              },
            ]}
            dataSource={securityDefinitions}
            size="small"
            pagination={false}
            bordered
          />
        </Form.Item>
      </Form>
    </Fragment>
  );
}
