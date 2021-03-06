import React, { useEffect } from "react";
import "./App.css";
import "antd/dist/antd.css";

import { useData } from "./hooks";
import GeneralInfo from "./components/GeneralInfo";
import Definitions from "./components/Definitions";
import Preview from "./components/Preview";
import Readme from "./components/Readme";
import SecurityDefinitions from "./components/SecurityDefinitions";
import Associations from "./components/Associations";
import Tags from "./components/Tags";
import Paths from "./components/Paths";
import GeneralInfoEdit from "./components/forms/GeneralInfoEdit";
import packageJson from "../package.json";

import {
  Layout,
  Button,
  Collapse,
  Icon,
  Menu,
  Alert,
  Row,
  Col,
  Modal,
} from "antd";
const { confirm } = Modal;

const { Header, Content, Footer } = Layout;
const { Panel } = Collapse;
const ButtonGroup = Button.Group;

function App() {
  const {
    state,
    isLoading,
    isSaving,
    isResetting,
    setLoading,
    setSaving,
    setResetting,
    page,
    setPage,
    showCode,
    setShowCode,
    showGenerator,
    setShowGenerator,
    dispatch,
    isUndo,
    setUndo,
    isRedo,
    setRedo,
    canUndo,
    canRedo,
    isClose,
    setClose,
    current,
    isTest,
    setTest,
  } = useData();
  console.log(state);
  console.log(current);

  useEffect(() => {
    document.title = `Swagger Go (v${packageJson.version})`;
  }, []);

  function handleClose() {
    confirm({
      title: "确认关闭项目文件?",
      content: "关闭后不可恢复，请先导出文件，谨慎操作!",
      okText: "关闭",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        console.log("OK");
        setClose(true);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  }

  if (!state) {
    return (
      <div className="App" style={{ overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%" }}>
          <Alert
            message="注：仅支持swagger2.0，未作3.0适配"
            type="warning"
            closable
            style={{ margin: 24, textAlign: "center" }}
          />
        </div>

        <Row
          type="flex"
          justify="center"
          align="middle"
          gutter={24}
          style={{ height: "100vh" }}
        >
          {/* <Col>
            <Button
              type="dashed"
              icon="plus"
              style={{ width: 200, height: 100 }}
              onClick={() => {
                dispatch({ type: "DATA_NEW" });
              }}
            >
              New
            </Button>
          </Col> */}
          <Col>
            <Button
              type="dashed"
              icon="snippets"
              style={{ width: 200, height: 100 }}
              onClick={() => {
                setResetting(true);
              }}
            >
              New
            </Button>
          </Col>
          <Col>
            <Button
              type="dashed"
              icon="upload"
              style={{ width: 200, height: 100 }}
              onClick={() => {
                setLoading(true);
              }}
            >
              Import
            </Button>
          </Col>
        </Row>
      </div>
    );
  }

  return (
    <div className="App">
      <Layout
        className="layout"
        style={{ height: "100vh", overflow: "hidden" }}
      >
        <Header style={{ position: "fixed", zIndex: 100, width: "100%" }}>
          <div className="header">
            <Menu
              theme="dark"
              mode="horizontal"
              style={{ lineHeight: "64px" }}
              selectedKeys={[page]}
              onClick={e => {
                setPage(e.key);
              }}
            >
              <Menu.Item key="edit">
                <Icon type="edit" />
                Edit
              </Menu.Item>
              <Menu.Item key="preview">
                <Icon type="eye" />
                Preview
              </Menu.Item>
              <Menu.Item key="readme">
                <Icon type="question-circle" />
                Readme
              </Menu.Item>
            </Menu>
            {page === "edit" && (
              <div className="header_buttons">
                <ButtonGroup>
                  <Button
                    icon="undo"
                    loading={isUndo}
                    disabled={isUndo || !canUndo}
                    onClick={() => {
                      setUndo(true);
                    }}
                  >
                    Undo
                  </Button>
                  <Button
                    icon="redo"
                    loading={isRedo}
                    disabled={isRedo || !canRedo}
                    onClick={() => {
                      setRedo(true);
                    }}
                  >
                    Redo
                  </Button>
                  <Button icon="close" loading={isClose} onClick={handleClose}>
                    Close
                  </Button>
                </ButtonGroup>
              </div>
            )}
            {page === "preview" && (
              <div className="header_buttons">
                <ButtonGroup>
                  <Button
                    icon="code"
                    onClick={() => {
                      setShowCode(true);
                    }}
                  >
                    Code
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
                    icon="experiment"
                    onClick={() => {
                      setShowGenerator(true);
                    }}
                  >
                    Generator
                  </Button>
                  {/* <Button
                    icon="number"
                    loading={isTest}
                    onClick={() => {
                      setTest(true);
                    }}
                  >
                    Test
                  </Button> */}
                </ButtonGroup>
              </div>
            )}
          </div>
        </Header>
        <Content style={{ marginTop: 64, overflow: "auto" }}>
          {page === "edit" && (
            <div style={{ background: "#fff", padding: "24px 50px" }}>
              <Collapse defaultActiveKey={[]}>
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
                <Panel header="Tags" key="tags">
                  <Tags state={state} dispatch={dispatch} />
                </Panel>
                <Panel header="Definitions" key="definitions">
                  <Definitions state={state} dispatch={dispatch} />
                </Panel>
                <Panel header="Associations" key="associations">
                  <Associations state={state} dispatch={dispatch} />
                </Panel>
                <Panel header="Paths" key="paths">
                  <Paths state={state} dispatch={dispatch} />
                </Panel>
              </Collapse>
            </div>
          )}
          {page === "preview" && (
            <div
              style={{
                background: "#fff",
                padding: "24px 0",
              }}
            >
              <Preview
                showCode={showCode}
                setShowCode={setShowCode}
                showGenerator={showGenerator}
                setShowGenerator={setShowGenerator}
                state={state}
              />
            </div>
          )}
          {page === "readme" && (
            <div style={{ background: "#fff", padding: "24px 50px" }}>
              <Readme />
            </div>
          )}
        </Content>
      </Layout>
    </div>
  );
}

export default App;
