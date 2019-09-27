import React, { Fragment } from "react";
import PathEdit from "./forms/PathEdit";
import { associationTypes } from "../config";
import { Icon, Button, Table, Divider, Badge } from "antd";

export default function Paths({ state, dispatch }) {
  /**
   * 计算值
   */
  const allTags = [];
  const paths = [];
  Object.entries(state.paths || {}).forEach(([path, pathItem]) => {
    Object.entries(pathItem).forEach(([method, methodItem]) => {
      allTags.push(...(methodItem.tags || "default"));
      !methodItem["x-auto"] &&
        paths.push({
          ...methodItem,
          path,
          method,
          key: `${path}-${method}`,
        });
    });
  });
  const tagsList = [...new Set(allTags)];

  /**
   * 删除
   * @param {Number} index
   */
  function handleAssociationRemove(index) {
    console.log(index);
    // const associations = state["x-associations"];
    // associations.splice(index);
    // dispatch({
    //   type: "DATA_UPDATE",
    //   payload: {
    //     "x-associations": [...associations],
    //   },
    // });
  }

  const columns = [
    {
      title: "Path",
      dataIndex: "path",
      render: (val, record) => (
        <Badge
          status={
            record.security && record.security.length === 0
              ? "success"
              : "default"
          }
          text={val}
        />
      ),
    },
    {
      title: "Method",
      dataIndex: "method",
    },
    {
      title: "Tags",
      dataIndex: "tags",
      render: val => (val || []).join(","),
    },
    {
      title: "Summary",
      dataIndex: "summary",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "OperationId",
      dataIndex: "operationId",
    },
    {
      title: "Parameters",
      dataIndex: "parameters",
      render: val =>
        (val || []).map((item, idx) => (
          <Badge
            key={idx}
            status={item.required ? "success" : "default"}
            text={`[${item.in}] ${item.name} (${item.description})`}
          />
        )),
    },
    {
      title: "Responses",
      dataIndex: "responses",
      render: val =>
        Object.entries(val).map(([k, v]) => (
          <div key={k}>
            - {k} ({v.description})
          </div>
        )),
    },
    {
      title: "操作",
      render: (_, record, index) => (
        <span>
          <PathEdit
            title="编辑"
            formMode="edit"
            dispatch={dispatch}
            state={state}
            data={record}
            dataIndex={index}
            tagsList={tagsList}
          >
            <Icon type="edit" />
          </PathEdit>
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
      {paths.length > 0 && (
        <Table
          columns={columns}
          bordered
          dataSource={paths}
          pagination={false}
          size="middle"
        />
      )}

      <PathEdit
        title="新增"
        formMode="create"
        dispatch={dispatch}
        state={state}
        data={{}}
        tagsList={tagsList}
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
      </PathEdit>
    </Fragment>
  );
}
