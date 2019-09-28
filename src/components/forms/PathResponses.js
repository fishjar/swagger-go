import React, { forwardRef } from "react";
import PathResponseEdit from "./PathResponseEdit";
import { Icon, Button, Table, Divider, Badge } from "antd";

function PathResponses({ value = {}, onChange, state }, ref) {
  const dataSource = Object.entries(value).map(([key, val]) => ({
    ...val,
    key,
  }));

  const handleEdit = ({ key, ...data }) => {
    if (onChange) {
      const newValue = { ...value };
      newValue[key] = {
        ...(newValue[key] || {}),
        ...data,
      };
      onChange(newValue);
    }
  };

  const handleDelete = key => {
    if (onChange) {
      const newValue = { ...value };
      delete newValue[key];
      onChange(newValue);
    }
  };

  const columns = [
    {
      title: "Response",
      dataIndex: "key",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "操作",
      render: (_, record, index) => (
        <span>
          <PathResponseEdit
            title="编辑"
            formMode="edit"
            state={state}
            data={record}
            dataIndex={index}
            onSubmit={handleEdit}
          >
            <Icon type="edit" />
          </PathResponseEdit>
          <Divider type="vertical" />
          <Icon
            onClick={() => {
              handleDelete(record.key);
            }}
            type="close"
          />
        </span>
      ),
    },
  ];

  return (
    <div ref={ref}>
      {dataSource.length > 0 && (
        <Table
          columns={columns}
          bordered
          dataSource={dataSource}
          pagination={false}
          size="middle"
        />
      )}

      <PathResponseEdit
        title="编辑"
        formMode="create"
        state={state}
        onSubmit={handleEdit}
      >
        <Button
          style={{
            width: "100%",
            marginTop: 16,
          }}
          type="dashed"
          icon="plus"
        >
          Add Response
        </Button>
      </PathResponseEdit>
    </div>
  );
}

// https://ant.design/components/form-cn/#components-form-demo-customized-form-controls
// https://reactjs.org/docs/forwarding-refs.html
export default forwardRef(PathResponses);
