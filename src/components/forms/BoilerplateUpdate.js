import React, { Fragment, useState } from "react";
import yaml from "js-yaml";
import { formItemLayout, defaultBoilerplates } from "../../config";
import {
  Form,
  Input,
  Icon,
  Button,
  Radio,
  Drawer,
  message,
  Spin,
  Tooltip,
} from "antd";

import {
  downloadBoilerplate,
  clipboardWrite,
} from "../../utils";

function BoilerplateUpdate({ showUpdate, setShowUpdate, form }) {
  const [spinning, setSpinning] = useState(false);
  const [tip, setTip] = useState("");
  const {
    getFieldDecorator,
    getFieldValue,
    resetFields,
    setFieldsValue,
  } = form;

  /**
   * 关闭抽屉
   */
  function handleHide() {
    handleReset();
    setShowUpdate(false);
  }

  /**
   * 重置表单
   */
  function handleReset() {
    resetFields();
    setSpinning(false);
    setTip("");
  }

  /**
   * 提交表单
   */
  function handleSubmit(e) {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      console.log(values);
      handleData(values);
    });
  }

  async function handleData({
    boilerplateName,
    repoBranch,
    repoUrl,
  }) {
    try {
      setSpinning(true);
      setTip("更新样板...");
      await downloadBoilerplate(
        boilerplateName,
        repoUrl,
        repoBranch,
        "boilerplate"
      );
      message.success("更新成功!");
      // handleHide();
    } catch (err) {
      console.log(err);
      message.error(err.message || "更新失败!");
    } finally {
      setSpinning(false);
      setTip("");
    }
  }

  function handleCopyRepoUrl() {
    clipboardWrite("https://github.com/" + getFieldValue("repoUrl"));
    message.success("复制成功");
  }

  const radioStyle = {
    display: "block",
    height: "30px",
    lineHeight: "30px",
  };

  return (
    <Drawer
      title="Local Boilerplate Update"
      placement="right"
      width="60%"
      onClose={handleHide}
      visible={showUpdate}
      destroyOnClose
    >
      <Spin tip={tip} spinning={spinning}>
        <Form {...formItemLayout} onSubmit={handleSubmit}>
          <Form.Item label="选择项目">
            {getFieldDecorator("boilerplateName", {
              rules: [
                {
                  required: true,
                  message: "请选择!",
                },
              ],
            })(
              <Radio.Group
                onChange={e => {
                  setFieldsValue({
                    repoUrl: defaultBoilerplates[e.target.value].url,
                  });
                }}
              >
                {Object.entries(defaultBoilerplates).map(
                  ([key, { disabled, language }]) => (
                    <Radio
                      style={radioStyle}
                      value={key}
                      key={key}
                      disabled={disabled}
                    >
                      {`${key} ( ${language} )`}
                    </Radio>
                  )
                )}
              </Radio.Group>
            )}
          </Form.Item>
          <Form.Item label="项目地址">
            {getFieldDecorator("repoUrl", {
              rules: [
                {
                  required: true,
                  message: "请填写!",
                },
              ],
            })(
              <Input
                addonBefore="https://github.com/"
                disabled
                suffix={
                  getFieldValue("repoUrl") && (
                    <Tooltip title="复制URL">
                      <Icon
                        onClick={handleCopyRepoUrl}
                        style={{ cursor: "pointer" }}
                        type="copy"
                      />
                    </Tooltip>
                  )
                }
              />
            )}
          </Form.Item>
          <Form.Item label="项目分支">
            {getFieldDecorator("repoBranch", {
              rules: [
                {
                  required: true,
                  message: "请选择!",
                },
              ],
            })(
              <Radio.Group>
                <Radio value={"master"}>mater</Radio>
                <Radio value={"dev"}>dev</Radio>
              </Radio.Group>
            )}
          </Form.Item>
        </Form>
      </Spin>
      <div
        style={{
          borderTop: "1px solid #e9e9e9",
          padding: "10px 16px",
          background: "#fff",
          textAlign: "right",
        }}
      >
        <Button onClick={handleHide} style={{ marginRight: 8 }}>
          Cancel
        </Button>
        <Button
          disabled={spinning}
          onClick={handleReset}
          style={{ marginRight: 8 }}
        >
          Reset
        </Button>
        <Button
          loading={spinning}
          disabled={spinning}
          onClick={handleSubmit}
          type="primary"
        >
          Ok
        </Button>
      </div>
    </Drawer>
  );
}

export default Form.create({ name: "boilerplateUpdate" })(BoilerplateUpdate);
