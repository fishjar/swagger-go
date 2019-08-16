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

function DateSelect({ value, onChange, showTime = false }, ref) {
  return (
    <DatePicker
      ref={ref}
      placeholder="请选择"
      value={value ? moment(value) : null}
      showTime={showTime}
      onChange={(_, dateStr) => {
        onChange && onChange(dateStr || undefined);
      }}
    />
  );
}

// https://ant.design/components/form-cn/#components-form-demo-customized-form-controls
// https://reactjs.org/docs/forwarding-refs.html
export default forwardRef(DateSelect);
