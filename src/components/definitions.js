import React, { Fragment, useState, useEffect } from "react";

import { apiOptions } from "../config";
import Definition from "./definition";

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
  const models = Object.keys(state.definitions).map(key => ({
    ...state.definitions[key],
    key,
  }));

  return (
    <Fragment>
      <Collapse defaultActiveKey={[]}>
        {models.map(({ key, ...data }) => (
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
                          color: (data["x-apis"] || []).includes(index)
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

                <Icon
                  type="edit"
                  onClick={event => {
                    // If you don't want click extra trigger collapse, you can prevent this:
                    event.stopPropagation();
                  }}
                  style={{ marginRight: 12 }}
                />
                <Icon
                  type="copy"
                  onClick={event => {
                    // If you don't want click extra trigger collapse, you can prevent this:
                    event.stopPropagation();
                  }}
                  style={{ marginRight: 12 }}
                />
                <Icon
                  type="close"
                  onClick={event => {
                    // If you don't want click extra trigger collapse, you can prevent this:
                    event.stopPropagation();
                  }}
                />
              </span>
            }
          >
            <Definition
              models={models}
              model={{ key, ...data }}
              dispatch={dispatch}
            />
          </Panel>
        ))}
      </Collapse>
      <Button
        style={{
          width: "100%",
          marginTop: 16,
          marginBottom: 8,
        }}
        type="dashed"
        onClick={() => {}}
        icon="plus"
      >
        Add Model
      </Button>
    </Fragment>
  );
}
