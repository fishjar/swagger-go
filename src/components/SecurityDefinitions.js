import React, { Fragment } from "react";
import SecurityEdit from "./forms/SecurityEdit";
import {
  Icon,
  Button,
  Table,
  Divider,
} from "antd";

export default function SecurityDefinitions({ state, dispatch }) {
  /**
   * 计算值
   * 将security对象转为列表
   */
  const securityItems = Object.entries(state.securityDefinitions || {}).map(
    ([key, values]) => ({
      ...values,
      key,
    })
  );

  /**
   * 删除security
   * @param {String} securityKey
   */
  function handleSecurityRemove(securityKey) {
    const securityDefinitions = { ...state.securityDefinitions };
    delete securityDefinitions[securityKey];
    dispatch({
      type: "DATA_UPDATE",
      payload: {
        securityDefinitions,
      },
    });
  }

  const columns = [
    {
      title: "Security",
      dataIndex: "key",
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "In",
      dataIndex: "in",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "操作",
      render: (text, record) => (
        <span>
          <SecurityEdit
            title="编辑"
            formMode="edit"
            dispatch={dispatch}
            state={state}
            security={record}
          >
            <Icon type="edit" />
          </SecurityEdit>
          <Divider type="vertical" />
          <Icon
            type="close"
            onClick={() => {
              handleSecurityRemove(record.key);
            }}
          />
        </span>
      ),
    },
  ];

  return (
    <Fragment>
      {securityItems.length > 0 && (
        <Table
          columns={columns}
          bordered
          dataSource={securityItems}
          pagination={false}
          size="middle"
        />
      )}

      <SecurityEdit
        title="新增"
        formMode="create"
        dispatch={dispatch}
        state={state}
        security={{}}
      >
        <Button
          style={{
            width: "100%",
            marginTop: 16,
          }}
          type="dashed"
          icon="plus"
        >
          Add Security
        </Button>
      </SecurityEdit>
    </Fragment>
  );
}
