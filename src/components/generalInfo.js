import React, { Fragment, useState, useEffect } from "react";
import SecurityModal from "./securityModal";
import { formItemLayout } from "../config";
import { Form, Input, Checkbox, Card, Icon, Button, Radio, Modal } from "antd";
const CheckboxGroup = Checkbox.Group;

export default function GeneralInfo({ state, dispatch }) {
  const [modalVisible, setModalVisible] = useState(false);

  function handleInputChange(e) {
    const { name, value } = e.target;
    dispatch({
      type: "DATA_UPDATE",
      payload: { [name]: value },
    });
  }

  function handleInputInfoChange(e) {
    const { name, value } = e.target;
    dispatch({
      type: "DATA_UPDATE",
      payload: { info: { ...state.info, [name]: value } },
    });
  }

  function handleSecurityType(securityKey, securityType) {
    if (securityType === "basic") {
      dispatch({
        type: "DATA_UPDATE",
        payload: {
          securityDefinitions: {
            ...state.securityDefinitions,
            [securityKey]: { type: securityType },
          },
        },
      });
    } else if (securityType === "apiKey") {
      dispatch({
        type: "DATA_UPDATE",
        payload: {
          securityDefinitions: {
            ...state.securityDefinitions,
            [securityKey]: {
              type: securityType,
              in: "header",
              name: "X-Authorization",
              description: "X-Authorization: Bearer {token}",
            },
          },
        },
      });
    }
  }

  function handleSecurityChange(key, name, value) {
    dispatch({
      type: "DATA_UPDATE",
      payload: {
        securityDefinitions: {
          ...state.securityDefinitions,
          [key]: {
            ...state.securityDefinitions[key],
            [name]: value,
          },
        },
      },
    });
  }

  function handleRemoveSecurity(key) {
    const newSecurityDefinitions = { ...state.securityDefinitions };
    delete newSecurityDefinitions[key];
    dispatch({
      type: "DATA_UPDATE",
      payload: {
        securityDefinitions: newSecurityDefinitions,
      },
    });
  }

  return (
    <Fragment>
      <Form {...formItemLayout}>
        <Form.Item label="swagger">
          <Input
            name="swagger"
            placeholder="2.0"
            value={state.swagger}
            disabled
          />
        </Form.Item>
        <Form.Item label="info.title">
          <Input
            name="title"
            placeholder="Swagger Petstore"
            value={state.info.title}
            onChange={handleInputInfoChange}
          />
        </Form.Item>
        <Form.Item label="info.version">
          <Input
            name="version"
            placeholder="0.1.0"
            value={state.info.version}
            onChange={handleInputInfoChange}
          />
        </Form.Item>
        <Form.Item label="info.description">
          <Input
            name="description"
            placeholder="0.1.0"
            value={state.info.description}
            onChange={handleInputInfoChange}
          />
        </Form.Item>
        <Form.Item label="schemes">
          <CheckboxGroup
            options={["http", "https"]}
            value={state.schemes}
            onChange={checkedList => {
              dispatch({
                type: "DATA_UPDATE",
                payload: { schemes: checkedList },
              });
            }}
          />
        </Form.Item>
        <Form.Item label="host">
          <Input
            name="host"
            placeholder="localhost:3000"
            value={state.host}
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item label="basePath">
          <Input
            name="basePath"
            placeholder="/api"
            value={state.basePath}
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item label="consumes">
          <CheckboxGroup
            options={["application/json", "application/xml"]}
            value={state.consumes}
            onChange={checkedList => {
              dispatch({
                type: "DATA_UPDATE",
                payload: { consumes: checkedList },
              });
            }}
          />
        </Form.Item>
        <Form.Item label="produces">
          <CheckboxGroup
            options={["application/json", "application/xml"]}
            value={state.produces}
            onChange={checkedList => {
              dispatch({
                type: "DATA_UPDATE",
                payload: { produces: checkedList },
              });
            }}
          />
        </Form.Item>
        <Form.Item label="securityDefinitions">
          {Object.keys(state.securityDefinitions).map(key => (
            <Card key={key} style={{ marginBottom: 16, position: "relative" }}>
              <Form.Item {...formItemLayout} label="security">
                {key}
              </Form.Item>
              <Form.Item {...formItemLayout} label="type">
                <Radio.Group
                  onChange={e => {
                    handleSecurityType(key, e.target.value);
                  }}
                  value={state.securityDefinitions[key].type}
                >
                  <Radio value={"basic"}>basic</Radio>
                  <Radio value={"apiKey"}>apiKey</Radio>
                  <Radio value={"oauth2"} disabled>
                    oauth2
                  </Radio>
                </Radio.Group>
              </Form.Item>
              {state.securityDefinitions[key].type === "apiKey" && (
                <Fragment>
                  <Form.Item {...formItemLayout} label="name">
                    <Input
                      name="name"
                      placeholder="Authorization"
                      value={state.securityDefinitions[key].name}
                      onChange={e => {
                        handleSecurityChange(
                          key,
                          e.target.name,
                          e.target.value
                        );
                      }}
                    />
                  </Form.Item>
                  <Form.Item {...formItemLayout} label="in">
                    <Radio.Group
                      name="in"
                      onChange={e => {
                        handleSecurityChange(
                          key,
                          e.target.name,
                          e.target.value
                        );
                      }}
                      value={state.securityDefinitions[key].in}
                    >
                      <Radio value={"header"}>header</Radio>
                      <Radio value={"query"}>query</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item {...formItemLayout} label="description">
                    <Input
                      name="description"
                      placeholder="Authorization: Bearer {token}"
                      value={state.securityDefinitions[key].description}
                      onChange={e => {
                        handleSecurityChange(
                          key,
                          e.target.name,
                          e.target.value
                        );
                      }}
                    />
                  </Form.Item>
                </Fragment>
              )}

              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                onClick={() => {
                  handleRemoveSecurity(key);
                }}
                style={{
                  position: "absolute",
                  top: 0,
                  right: -20,
                }}
              />
            </Card>
          ))}
          <Button
            type="dashed"
            style={{ width: "100%" }}
            onClick={() => {
              setModalVisible(true);
            }}
          >
            <Icon type="plus" /> Add field
          </Button>
          <SecurityModal
            state={state}
            dispatch={dispatch}
            visible={modalVisible}
            setModalVisible={setModalVisible}
          />
        </Form.Item>
      </Form>
    </Fragment>
  );
}
