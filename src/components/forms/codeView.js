import React, { Fragment, useState, useEffect } from "react";
import yaml from "js-yaml";
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { clipboardWrite } from "../../utils";
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

export default function CodeView({ state, showCode, setShowCode }) {
  const [codeFormat, setCodeFormat] = useState("yaml");
  const [source, setSource] = useState("");

  useEffect(() => {
    switch (codeFormat) {
      case "yaml":
        setSource(yaml.dump(state));
        break;
      case "json":
        setSource(JSON.stringify(state, null, "  "));
        break;
      default:
        setSource("");
    }
  }, [codeFormat, state]);

  function handleCopy() {
    clipboardWrite(source);
    message.success("复制成功");
  }

  return (
    <Drawer
      title="Code Preview"
      placement="left"
      width="60%"
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
          <Button icon="copy" onClick={handleCopy}>
            Copy
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <SyntaxHighlighter language="yaml" style={a11yDark} showLineNumbers>
            {source}
          </SyntaxHighlighter>
        </Col>
      </Row>
    </Drawer>
  );
}
