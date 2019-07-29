import React, { Fragment, useState, useEffect, useReducer } from "react";
import "./App.css";
import "antd/dist/antd.css";
import {
  Layout,
  Button,
  Upload,
  Collapse,
  Icon,
  Input,
  Divider,
  Popconfirm,
  Table
} from "antd";
const { Header, Content, Footer } = Layout;
const { Panel } = Collapse;



const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return { ...state, isLoading: true, isError: false };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true
      };
    default:
      throw new Error();
  }
};

const useDataApi = (initialUrl, initialData) => {
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData
  });

  useEffect(() => {
    let didCancel = false;

    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" });

      try {
        const result = await axios(url);

        if (!didCancel) {
          dispatch({ type: "FETCH_SUCCESS", payload: result.data });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: "FETCH_FAILURE" });
        }
      }
    };

    fetchData();

    return () => {
      didCancel = true;
    };
  }, [url]);

  return [state, setUrl];
};

function App() {
  
  function beforeUpload(file) {
    console.log(file);
    console.log(file.path);
    // https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader
    const fileReader = new FileReader();
    fileReader.onload = event => {
      console.log(JSON.parse(event.target.result));
    };
    fileReader.readAsText(file);
    return false;
  }

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
        <Header>
          <div className="header">
            <div className="logo">TEST</div>
            <div className="header_buttons">
              <Upload showUploadList={false} beforeUpload={beforeUpload}>
                <Button type="upload" shape="round" icon="upload">
                  Upload
                </Button>
              </Upload>
              <Button shape="round" icon="download">
                Download
              </Button>
            </div>
          </div>
        </Header>
        <Content>
          <div style={{ background: "#fff", padding: 24 }}>
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
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
    </div>
  );
}

export default App;
