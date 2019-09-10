import React, { Fragment, useState, useEffect, forwardRef } from "react";
import moment from "moment";
import {
  formItemLayout,
  dataFormats,
  numTypes,
  standDataTypes,
} from "../../config";
import { getModelProps } from "../../utils";
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
  Switch,
} from "antd";
const { Panel } = Collapse;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;
const InputGroup = Input.Group;
const { TextArea } = Input;

function RefFields({ value, refFields = [], onChange }, ref) {
  return (
    <Table
      ref={ref}
      columns={[
        {
          title: "",
          dataIndex: "_",
          render: (_, record) => (
            <Checkbox
              checked={value === record.key}
              onChange={() => {
                onChange(record.key);
              }}
            />
          ),
        },
        {
          title: "Key",
          dataIndex: "key",
        },
        {
          title: "Type",
          dataIndex: "type",
        },
        {
          title: "Description",
          dataIndex: "description",
        },
        {
          title: "Example",
          dataIndex: "example",
          render: text => (
            <div
              style={{
                wordWrap: "break-word",
                wordBreak: "break-all",
              }}
            >
              {text === undefined ? "" : JSON.stringify(text)}
            </div>
          ),
        },
      ]}
      dataSource={refFields}
      size="small"
      pagination={false}
      bordered
    />
  );
}

// https://ant.design/components/form-cn/#components-form-demo-customized-form-controls
// https://reactjs.org/docs/forwarding-refs.html
export default forwardRef(RefFields);
