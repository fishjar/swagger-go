import React, { Fragment } from "react";
import AssociationEdit from "./forms/AssociationEdit";
import { associationTypes } from "../config";
import { Icon, Button, Table, Divider, Badge } from "antd";

export default function Associations({ state, dispatch }) {
  /**
   * 计算值
   */
  const associations = (state["x-associations"] || []).map((item, index) => ({
    ...item,
    key: index,
  }));

  /**
   * 删除
   * @param {Number} index
   */
  function handleAssociationRemove(index) {
    const newAssociations = [...associations];
    newAssociations.splice(index, 1);
    dispatch({
      type: "DATA_UPDATE",
      payload: {
        "x-associations": [...newAssociations],
      },
    });
  }

  const columns = [
    {
      title: "Source",
      dataIndex: "source",
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Target",
      dataIndex: "target",
    },
    {
      title: "As",
      dataIndex: "as",
    },
    {
      title: "Through",
      dataIndex: "through",
      render: (text, record) =>
        record.type === "belongsToMany" && (
          <Badge
            status={record.throughModel ? "success" : "default"}
            text={text}
          />
        ),
    },
    {
      title: "ForeignKey",
      dataIndex: "foreignKey",
    },
    {
      title: "OtherKey",
      dataIndex: "otherKey",
      render: (_, record) =>
        `${associationTypes[record.type]}: ${
          record[associationTypes[record.type]]
        }`,
    },
    {
      title: "操作",
      render: (_, record, index) => (
        <span>
          <AssociationEdit
            title="编辑"
            formMode="edit"
            dispatch={dispatch}
            state={state}
            association={record}
            dataIndex={index}
          >
            <Icon type="edit" />
          </AssociationEdit>
          <Divider type="vertical" />
          <Icon
            type="close"
            onClick={() => {
              handleAssociationRemove(record.key);
            }}
          />
        </span>
      ),
    },
  ];

  return (
    <Fragment>
      {associations.length > 0 && (
        <Table
          columns={columns}
          bordered
          dataSource={associations}
          pagination={false}
          size="middle"
        />
      )}

      <AssociationEdit
        title="新增"
        formMode="create"
        dispatch={dispatch}
        state={state}
        association={{}}
      >
        <Button
          style={{
            width: "100%",
            marginTop: 16,
          }}
          type="dashed"
          icon="plus"
        >
          Add Association
        </Button>
      </AssociationEdit>
    </Fragment>
  );
}
