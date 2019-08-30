import React, { Fragment, useState, useEffect } from "react";
import yaml from "js-yaml";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
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
  Row,
  Col,
} from "antd";

import CodeView from "./forms/codeView";
import BoilerplateGenerator from "./forms/boilerplateGenerator";

export default function Preview({
  state,
  showCode,
  setShowCode,
  showGenerator,
  setShowGenerator,
}) {
  return (
    <Fragment>
      <SwaggerUI spec={state} />
      <CodeView state={state} showCode={showCode} setShowCode={setShowCode} />
      <BoilerplateGenerator
        state={state}
        showGenerator={showGenerator}
        setShowGenerator={setShowGenerator}
      />
    </Fragment>
  );
}
