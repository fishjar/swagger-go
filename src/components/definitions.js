import React, { Fragment, useState, useEffect } from "react";

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
} from "antd";
const { Panel } = Collapse;
const CheckboxGroup = Checkbox.Group;

export default function Definitions({ state, dispatch }) {
  const definitions = Object.keys(state.definitions).map(key => ({
    ...state.definitions[key],
    key,
  }));
  // console.log(definitions);
  const optionsWithDisabled = [
    { label: "Apple", value: "Apple" },
    { label: "Pear", value: "Pear" },
    { label: "Orange", value: "Orange", disabled: false },
    { label: "Apple", value: "Apple" },
    { label: "Pear", value: "Pear" },
    { label: "Orange", value: "Orange", disabled: false },
    { label: "Apple", value: "Apple" },
    { label: "Pear", value: "Pear" },
    { label: "Orange", value: "Orange", disabled: false },
  ];
  return (
    <Fragment>
      <Collapse defaultActiveKey={[]}>
        {definitions.map(item => (
          <Panel
            header={
              item["x-isModel"]
                ? `${item.key} (${item["x-plural"]})(${item["x-tableName"]}) (${
                    item.description
                  })`
                : `${item.key} (${item.description})`
            }
            key={item.key}
            extra={
              <span>
                <Checkbox.Group
                  options={optionsWithDisabled}
                  disabled
                  defaultValue={["Apple"]}
                  style={{ marginRight: 12 }}
                />
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
            <Definition key={item.key} definition={item} dispatch={dispatch} />
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
