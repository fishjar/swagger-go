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
  const definitions = Object.keys(state.definitions).map(key => ({
    ...state.definitions[key],
    key,
  }));

  return (
    <Fragment>
      <Collapse defaultActiveKey={[]}>
        {definitions.map(definition => (
          <Panel
            header={
              definition["x-isModel"]
                ? `${definition.key} [${definition["x-plural"]}][${
                    definition["x-tableName"]
                  }] (${definition.description})`
                : `${definition.key} (${definition.description || ""})`
            }
            key={definition.key}
            extra={
              <span>
                {definition["x-isModel"] && (
                  <span style={{ marginRight: 12 }}>
                    {apiOptions.map((api, index) => (
                      <Badge
                        key={index}
                        count={index}
                        showZero
                        style={{
                          backgroundColor: "#fff",
                          color: (definition["x-apis"] || []).includes(index)
                            ? "#52c41a"
                            : "#999",
                          boxShadow: "0 0 0 1px #d9d9d9 inset",
                        }}
                        title={`${
                          api.method
                        }("/${definition.key.toLowerCase()}${api.path}") ${
                          api.notice
                        }(${api.key})`}
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
                  type="close"
                  onClick={event => {
                    // If you don't want click extra trigger collapse, you can prevent this:
                    event.stopPropagation();
                  }}
                />
              </span>
            }
          >
            <Definition definition={definition} dispatch={dispatch} />
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
        新增成员
      </Button>
    </Fragment>
  );
}
