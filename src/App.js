import React, { useState } from "react";
import "./App.css";
import "antd/dist/antd.css";

import { useData } from "./hooks";
import GeneralInfo from "./components/generalInfo";
import Definitions from "./components/definitions";
import SecurityDefinitions from "./components/securityDefinitions";
import GeneralInfoEdit from "./components/forms/generalInfoEdit";

import {
  Layout,
  Button,
  Collapse,
  Icon,
  Input,
  Divider,
  Popconfirm,
  Table,
  Card,
  Radio,
  Menu,
  Alert,
} from "antd";

const { Header, Content, Footer } = Layout;
const { Panel } = Collapse;
const ButtonGroup = Button.Group;

function App() {
  const [size, setSize] = useState("large");
  const {
    state,
    isLoading,
    isSaving,
    isResetting,
    setLoading,
    setSaving,
    setResetting,
    dispatch,
  } = useData();
  console.log(state);

  return (
    <div className="App">
      <Layout className="layout">
        <Header style={{ position: "fixed", zIndex: 100, width: "100%" }}>
          <div className="header">
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={["edit"]}
              style={{ lineHeight: "64px" }}
            >
              <Menu.Item key="edit">
                <Icon type="edit" />
                Edit
              </Menu.Item>
              <Menu.Item key="preview" disabled>
                <Icon type="eye" />
                Preview
              </Menu.Item>
            </Menu>
            <div className="header_buttons">
              <ButtonGroup
                style={{
                  marginRight: 16,
                }}
              >
                <Button icon="undo">Undo</Button>
                <Button icon="redo">Redo</Button>
              </ButtonGroup>
              <ButtonGroup>
                <Button
                  icon="upload"
                  loading={isLoading}
                  disabled={isLoading}
                  onClick={() => {
                    setLoading(true);
                  }}
                >
                  Import
                </Button>
                <Button
                  icon="download"
                  loading={isSaving}
                  disabled={!state || isSaving}
                  onClick={() => {
                    setSaving(true);
                  }}
                >
                  Export
                </Button>
                <Button
                  icon="rollback"
                  loading={isResetting}
                  disabled={isResetting}
                  onClick={() => {
                    setResetting(true);
                  }}
                >
                  Reset
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </Header>
        <Content style={{ marginTop: 64 }}>
          {state && (
            <div style={{ background: "#fff", padding: "24px 50px" }}>
              <Alert
                message="仅支持2.0，未作3.0适配"
                type="warning"
                closable
                style={{ marginBottom: 24, textAlign: "center" }}
              />
              <Collapse defaultActiveKey={["info"]}>
                <Panel
                  header="General Info"
                  key="info"
                  extra={
                    <GeneralInfoEdit state={state} dispatch={dispatch}>
                      <Icon type="edit" />
                    </GeneralInfoEdit>
                  }
                >
                  <GeneralInfo state={state} dispatch={dispatch} />
                </Panel>
                <Panel header="SecurityDefinitions" key="security">
                  <SecurityDefinitions state={state} dispatch={dispatch} />
                </Panel>
                <Panel header="Definitions" key="definitions">
                  <Definitions state={state} dispatch={dispatch} />
                </Panel>
                <Panel header="Paths" key="paths">
                  <p>开发中...</p>
                </Panel>
              </Collapse>
            </div>
          )}
        </Content>
        {/* <Footer style={{ textAlign: "center" }}>©2018</Footer> */}
      </Layout>
    </div>
  );
}

export default App;
