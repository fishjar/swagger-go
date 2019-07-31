import React from "react";

import { useData } from "./hooks";
import "./App.css";
import "antd/dist/antd.css";
import {
  Layout,
  Button,
  Collapse,
  Icon,
  Input,
  Divider,
  Popconfirm,
  Table,
  Spin,
  Alert
} from "antd";

const { Header, Content, Footer } = Layout;
const { Panel } = Collapse;
const ButtonGroup = Button.Group;

function App() {
  const {
    state,
    msgs,
    isLoading,
    isSaving,
    isResetting,
    setLoading,
    setSaving,
    setResetting,
    setMsgs,
    dispatch
  } = useData();
  console.log(state);

  const columns = [
    {
      title: "成员姓名",
      dataIndex: "name",
      key: "name",
      width: "20%",
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              autoFocus
              onChange={e => this.handleFieldChange(e, "name", record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="成员姓名"
            />
          );
        }
        return text;
      }
    },
    {
      title: "工号",
      dataIndex: "workId",
      key: "workId",
      width: "20%",
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              onChange={e => this.handleFieldChange(e, "workId", record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="工号"
            />
          );
        }
        return text;
      }
    },
    {
      title: "所属部门",
      dataIndex: "department",
      key: "department",
      width: "40%",
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              onChange={e =>
                this.handleFieldChange(e, "department", record.key)
              }
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="所属部门"
            />
          );
        }
        return text;
      }
    },
    {
      title: "操作",
      key: "action",
      render: (text, record) => {
        // if (!!record.editable && this.state.loading) {
        //   return null;
        // }
        if (record.editable) {
          if (record.isNew) {
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.key)}>添加</a>
                <Divider type="vertical" />
                <Popconfirm
                  title="是否要删除此行？"
                  onConfirm={() => this.remove(record.key)}
                >
                  <a>删除</a>
                </Popconfirm>
              </span>
            );
          }
          return (
            <span>
              <a onClick={e => this.saveRow(e, record.key)}>保存</a>
              <Divider type="vertical" />
              <a onClick={e => this.cancel(e, record.key)}>取消</a>
            </span>
          );
        }
        return (
          <span>
            <a onClick={e => this.toggleEditable(e, record.key)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm
              title="是否要删除此行？"
              onConfirm={() => this.remove(record.key)}
            >
              <a>删除</a>
            </Popconfirm>
          </span>
        );
      }
    }
  ];

  return (
    <div className="App">
      <Layout className="layout">
        <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
          <div className="header">
            <div className="logo">TEST</div>
            <div className="header_buttons">
              <ButtonGroup>
                {isLoading ? (
                  <Button icon="upload" loading>
                    Upload
                  </Button>
                ) : (
                  <Button
                    icon="upload"
                    onClick={() => {
                      setLoading(true);
                    }}
                  >
                    Upload
                  </Button>
                )}

                {state &&
                  (isSaving ? (
                    <Button icon="download" loading>
                      Download
                    </Button>
                  ) : (
                    <Button
                      icon="download"
                      onClick={() => {
                        setSaving(true);
                      }}
                    >
                      Download
                    </Button>
                  ))}

                {isResetting ? (
                  <Button icon="plus" loading>
                    New
                  </Button>
                ) : (
                  <Button
                    icon="plus"
                    onClick={() => {
                      setResetting(true);
                    }}
                  >
                    New
                  </Button>
                )}

                <Button
                  onClick={() => {
                    //
                  }}
                >
                  TEST
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </Header>
        <Content style={{ marginTop: 64 }}>
          {/* <div>
            <p>{"isLoading: " + isLoading}</p>
            <p>{"isSaving: " + isSaving}</p>
            <p>{"isResetting: " + isResetting}</p>
          </div> */}

          {msgs.length > 0 && (
            <div
              style={{
                background: "#fff",
                padding: "24px 50px",
                textAlign: "center"
              }}
            >
              {msgs.map((item, index) => (
                <Alert message={item} key={index} type="error" closable />
              ))}
            </div>
          )}

          {state && (
            <div style={{ background: "#fff", padding: "24px 50px" }}>
              <Collapse defaultActiveKey={["1"]}>
                <Panel
                  header="This is panel header 1"
                  key="1"
                  extra={
                    <Icon
                      type="setting"
                      onClick={event => {
                        // If you don't want click extra trigger collapse, you can prevent this:
                        event.stopPropagation();
                      }}
                    />
                  }
                >
                  <p>This is panel header 1</p>
                  <Collapse defaultActiveKey={["1"]}>
                    <Panel header="This is panel header 1" key="1">
                      <p>This is panel header 1</p>
                    </Panel>
                    <Panel header="This is panel header 2" key="2">
                      <p>This is panel header 1</p>
                    </Panel>
                    <Panel header="This is panel header 3" key="3">
                      <p>This is panel header 1</p>
                    </Panel>
                  </Collapse>
                </Panel>
                <Panel header="This is panel header 2" key="2">
                  <p>This is panel header 1</p>
                  <Table
                    columns={columns}
                    dataSource={[
                      {
                        key: `NEW_TEMP_ID_1`,
                        workId: "",
                        name: "",
                        department: "",
                        editable: true,
                        isNew: true
                      }
                    ]}
                    pagination={false}
                    // rowClassName={record => {
                    //   return record.editable ? styles.editable : "";
                    // }}
                  />
                  <Button
                    style={{ width: "100%", marginTop: 16, marginBottom: 8 }}
                    type="dashed"
                    onClick={() => {}}
                    icon="plus"
                  >
                    新增成员
                  </Button>
                </Panel>
                <Panel header="This is panel header 3" key="3">
                  <p>This is panel header 1</p>
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
