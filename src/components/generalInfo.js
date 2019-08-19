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
      </Form>
    </Fragment>
  );
}
