import React from "react";
import "./App.css";
import "antd/dist/antd.css";
import { Layout, Button, Upload, Collapse, Icon } from "antd";
const { Header, Content, Footer } = Layout;
const { Panel } = Collapse;

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

function App() {
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
