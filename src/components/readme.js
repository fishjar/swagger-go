import React, { Fragment, useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
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

export default function Readme({ state }) {
  return (
    <ReactMarkdown source={"# This is a header\n\nAnd this is a paragraph"} />
  );
}
