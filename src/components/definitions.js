import React, { Fragment, useState, useEffect } from "react";

import { apiOptions } from "../config";
import Definition from "./definition";
import ModelEdit from "./forms/modelEdit";
import ModelCopy from "./forms/modelCopy";

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
  const models = Object.entries(state.definitions).map(([key, values]) => ({
    ...values,
    key,
  }));

  /**
   * 删除模型
   * @param {String} modelKey 
   */
  function handleModelRemove(modelKey) {
    const { [modelKey]: _, ...payload } = state.definitions;
    dispatch({
      type: "MODEL_RESET",
      payload,
    });
  }

  return (
    <Fragment>
      <Collapse defaultActiveKey={["Foo"]}>
        {models.map(model => (
          <Panel
            header={
              model["x-isModel"]
                ? `${model.key} [${model["x-plural"]}][${
                    model["x-tableName"]
                  }] (${model.description})`
                : `${model.key} (${model.description || ""})`
            }
            key={model.key}
            extra={
              <span>
                {model["x-isModel"] && (
                  <span style={{ marginRight: 12 }}>
                    {apiOptions.map(({ key, method, notice, path }, index) => (
                      <Badge
                        key={key}
                        count={index}
                        showZero
                        style={{
                          backgroundColor: "#fff",
                          color: (model["x-apis"] || []).includes(key)
                            ? "#52c41a"
                            : "#999",
                          boxShadow: "0 0 0 1px #d9d9d9 inset",
                        }}
                        title={`${method}("/${model.key.toLowerCase()}${path}") ${notice}(${key})`}
                      />
                    ))}
                  </span>
                )}

                <ModelEdit
                  title="编辑模型"
                  formMode="edit"
                  models={models}
                  model={model}
                  dispatch={dispatch}
                >
                  <Icon type="edit" style={{ marginRight: 12 }} />
                </ModelEdit>

                <ModelCopy
                  title="编辑模型"
                  formMode="copy"
                  models={models}
                  model={model}
                  dispatch={dispatch}
                >
                  <Icon type="copy" style={{ marginRight: 12 }} />
                </ModelCopy>

                <Icon
                  type="close"
                  onClick={event => {
                    event.stopPropagation();
                    handleModelRemove(model.key);
                  }}
                />
              </span>
            }
          >
            <Definition models={models} model={model} dispatch={dispatch} />
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
