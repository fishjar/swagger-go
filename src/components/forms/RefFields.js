import React, { forwardRef } from "react";
import {
  Checkbox,
  Table,
} from "antd";

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
