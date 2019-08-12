import React, { Fragment, useState, useEffect } from "react";

import { apiOptions } from "../config";
import Definition from "./definition";
import ModelEdit from "./drawers/modelEdit";
import ModelCopy from "./drawers/modelCopy";

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
  Tag,
  Badge,
} from "antd";
const { Panel } = Collapse;
const CheckboxGroup = Checkbox.Group;

export default function Definitions({ state, dispatch }) {
  /**
   * 计算值
   * 将模型对象转为模型列表
   */
  const models = Object.entries(state.definitions).map(([key, data]) => ({
    key,
    data,
  }));

  function handleModelRemove(key) {
    const { [key]: _, ...payload } = state.definitions;
    dispatch({
      type: "MODEL_RESET",
      payload,
    });
  }

  return (
    <Fragment>
      <Collapse defaultActiveKey={[]}>
        {models.map(({ key, data }) => (
          <Panel
            header={
              data["x-isModel"]
                ? `${key} [${data["x-plural"]}][${data["x-tableName"]}] (${
                    data.description
                  })`
                : `${key} (${data.description || ""})`
            }
            key={key}
            extra={
              <span>
                {data["x-isModel"] && (
                  <span style={{ marginRight: 12 }}>
                    {apiOptions.map((api, index) => (
                      <Badge
                        key={index}
                        count={index}
                        showZero
                        style={{
                          backgroundColor: "#fff",
                          color: (data["x-apis"] || []).includes(api.key)
                            ? "#52c41a"
                            : "#999",
                          boxShadow: "0 0 0 1px #d9d9d9 inset",
                        }}
                        title={`${api.method}("/${key.toLowerCase()}${
                          api.path
                        }") ${api.notice}(${api.key})`}
                      />
                    ))}
                  </span>
                )}

                <ModelEdit
                  title="编辑模型"
                  formMode="edit"
                  models={models}
                  model={{ key, data }}
                  dispatch={dispatch}
                >
                  <Icon type="edit" style={{ marginRight: 12 }} />
                </ModelEdit>

                <ModelCopy
                  title="编辑模型"
                  formMode="copy"
                  models={models}
                  model={{ key, data }}
                  dispatch={dispatch}
                >
                  <Icon type="copy" style={{ marginRight: 12 }} />
                </ModelCopy>

                <Icon
                  type="close"
                  onClick={event => {
                    event.stopPropagation();
                    handleModelRemove(key);
                  }}
                />
              </span>
            }
          >
            <Definition
              models={models}
              model={{ key, data }}
              dispatch={dispatch}
            />
          </Panel>
        ))}
      </Collapse>
      <ModelEdit
        title="新增模型"
        formMode="create"
        models={models}
        model={{}}
        dispatch={dispatch}
      >
        <Button
          style={{
            width: "100%",
            marginTop: 16,
          }}
          type="dashed"
          icon="plus"
        >
          Add Model
        </Button>
      </ModelEdit>
    </Fragment>
  );
}
