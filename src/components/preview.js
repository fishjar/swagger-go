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

export default function Preview({
  state,
  showCode,
  setShowCode,
  showGenerator,
  setShowGenerator,
}) {
  const [codeFormat, setCodeFormat] = useState("yaml");
  return (
    <Fragment>
      <SwaggerUI spec={state} />
      <Drawer
        title="Code Preview"
        placement="left"
        width="50%"
        onClose={() => {
          setShowCode(false);
        }}
        visible={showCode}
      >
        <Row type="flex" justify="space-between">
          <Col>
            <Radio.Group
              onChange={e => {
                setCodeFormat(e.target.value);
              }}
              value={codeFormat}
              style={{
                marginBottom: 12,
              }}
            >
              <Radio.Button value="yaml">YAML</Radio.Button>
              <Radio.Button value="json">JSON</Radio.Button>
            </Radio.Group>
          </Col>
          <Col>
            <Button icon="copy">Copy</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            {codeFormat === "yaml" && (
              <SyntaxHighlighter
                language="yaml"
                style={a11yDark}
                showLineNumbers
              >
                {yaml.dump(state)}
              </SyntaxHighlighter>
            )}
            {codeFormat === "json" && (
              <SyntaxHighlighter
                language="json"
                style={a11yDark}
                showLineNumbers
              >
                {JSON.stringify(state, null, "  ")}
              </SyntaxHighlighter>
            )}
          </Col>
        </Row>
      </Drawer>
      <Drawer
        title="Boilerplate Generator"
        placement="right"
        width="50%"
        onClose={() => {
          setShowGenerator(false);
        }}
        visible={showGenerator}
      >
        test
      </Drawer>
    </Fragment>
  );
}
