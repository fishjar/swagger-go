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

function JSONEdit({ value, onChange }, ref) {
  const [errmsg, setErrmsg] = useState("");

  function handleChange(e) {
    if (onChange) {
      if (e.target.value) {
        try {
          setErrmsg("");
          onChange(JSON.parse(e.target.value));
        } catch (err) {
          console.log(err);
          setErrmsg("格式有误");
          onChange(undefined);
        }
      } else {
        setErrmsg("");
        onChange(undefined);
      }
    }
  }

  return (
    <div ref={ref}>
      <TextArea
        placeholder="请输入"
        defaultValue={
          value === undefined ? "" : JSON.stringify(value, null, "  ")
        }
        onChange={handleChange}
        autosize
      />
      <div style={{ color: "#f5222d" }}>{errmsg}</div>
    </div>
  );
}

// https://ant.design/components/form-cn/#components-form-demo-customized-form-controls
// https://reactjs.org/docs/forwarding-refs.html
export default forwardRef(JSONEdit);
