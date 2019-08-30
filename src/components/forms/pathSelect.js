import React, { Fragment, useState, useEffect, forwardRef } from "react";
import moment from "moment";
import {
  formItemLayout,
  dataFormats,
  numTypes,
  standDataTypes,
} from "../../config";
import { getModelProps, openPath } from "../../utils";
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
  Row,
  Col,
} from "antd";
const { Panel } = Collapse;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;
const InputGroup = Input.Group;
const { TextArea } = Input;

function PathSelect({ value, onChange }, ref) {
  const handlePathSelect = () => {
    openPath()
      .then(res => {
        onChange && onChange(res);
      })
      .catch(err => {
        console.log(err);
        // message.error(err.message || "选择失败");
      });
  };

  return (
    <Row ref={ref}>
      <Col>
        <Row>
          <Col>
            <Button type="dashed" onClick={handlePathSelect}>
              <Icon type="select" />
              点击选择
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>{value}</Col>
        </Row>
      </Col>
    </Row>
  );
}

// https://ant.design/components/form-cn/#components-form-demo-customized-form-controls
// https://reactjs.org/docs/forwarding-refs.html
export default forwardRef(PathSelect);
