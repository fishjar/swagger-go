import React, { Fragment } from "react";
import PathEdit from "./forms/PathEdit";
import TagEdit from "./forms/TagEdit";
import { associationTypes } from "../config";
import { Icon, Button, Table, Divider, Badge } from "antd";

export default function Tags({ state, dispatch }) {
  /**
   * 计算值
   */
  const { tags = [] } = state;
  let usedTags = [];
  Object.entries(state.paths || {}).forEach(([_, pathItem]) => {
    Object.entries(pathItem).forEach(([_, methodItem]) => {
      usedTags.push(...(methodItem.tags || ["default"]));
    });
  });
  usedTags = [...new Set(usedTags)];

  /**
   * 删除
   * @param {Number} index
   */
  function handleTagRemove(index) {
    const newTags = [...tags];
    newTags.splice(index, 1);
    dispatch({
      type: "DATA_UPDATE",
      payload: { tags: newTags },
    });
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "ExternalDocs.description",
      dataIndex: "externalDocs.description",
    },
    {
      title: "ExternalDocs.url",
      dataIndex: "externalDocs.url",
    },
    {
      title: "操作",
      render: (_, record, index) => (
        <span>
          <TagEdit
            title="编辑"
            formMode="edit"
            dispatch={dispatch}
            state={state}
            data={record}
            dataIndex={index}
            usedTags={usedTags}
          >
            <Icon type="edit" />
          </TagEdit>
          <Divider type="vertical" />
          <Icon
            type="close"
            onClick={() => {
              handleTagRemove(index);
            }}
          />
        </span>
      ),
    },
  ];

  return (
    <Fragment>
      {tags.length > 0 && (
        <Table
          columns={columns}
          bordered
          dataSource={tags}
          pagination={false}
          size="middle"
          rowKey="name"
        />
      )}

      <TagEdit
        title="新增"
        formMode="create"
        dispatch={dispatch}
        state={state}
        data={{}}
        usedTags={usedTags}
      >
        <Button
          style={{
            width: "100%",
            marginTop: 16,
          }}
          type="dashed"
          icon="plus"
        >
          Add Tag
        </Button>
      </TagEdit>
    </Fragment>
  );
}
