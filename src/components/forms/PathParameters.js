import React, { forwardRef } from "react";
import PathParameterEdit from "./PathParameterEdit";
import { Icon, Button, Table, Divider, Badge } from "antd";

function PathParameters({ value = [], onChange, state }, ref) {
  const handleEdit = (data, index) => {
    if (onChange) {
      const newValue = [...value];
      if (index) {
        newValue[index] = {
          ...(newValue[index] || {}),
          ...data,
        };
      } else {
        newValue.push(data);
      }
      onChange(newValue);
    }
  };

  const handleDelete = index => {
    if (onChange) {
      const newValue = [...value];
      newValue.splice(index, 1);
      onChange(newValue);
    }
  };

  const columns = [
    {
      title: "In",
      dataIndex: "in",
      render: (val, record) => (
        <Badge status={record.required ? "success" : "default"} text={val} />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "操作",
      render: (_, record, index) => (
        <span>
          <PathParameterEdit
            title="编辑"
            formMode="edit"
            state={state}
            data={record}
            dataIndex={index}
            onSubmit={handleEdit}
          >
            <Icon type="edit" />
          </PathParameterEdit>
          <Divider type="vertical" />
          <Icon
            onClick={() => {
              handleDelete(index);
            }}
            type="close"
          />
        </span>
      ),
    },
  ];

  return (
    <div ref={ref}>
      {value.length > 0 && (
        <Table
          columns={columns}
          bordered
          dataSource={value}
          pagination={false}
          size="middle"
          rowKey="name"
        />
      )}

      <PathParameterEdit
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
          Add Parameter
        </Button>
      </PathParameterEdit>
    </div>
  );
}

// https://ant.design/components/form-cn/#components-form-demo-customized-form-controls
// https://reactjs.org/docs/forwarding-refs.html
export default forwardRef(PathParameters);
