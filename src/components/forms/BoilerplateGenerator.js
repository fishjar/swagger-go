import React, { Fragment, useState } from "react";
import yaml from "js-yaml";
import { formItemLayout, dataFormats, defaultBoilerplates } from "../../config";
import {
  Form,
  Input,
  Icon,
  Button,
  Radio,
  Drawer,
  message,
  Switch,
  Spin,
  Tooltip,
} from "antd";
import PathSelect from "./PathSelect";
import BoilerplateUpdate from "./BoilerplateUpdate";

import {
  copyBoilerplate,
  archiverBoilerplate,
  generateBoilerplate,
  downloadBoilerplate,
  checkPath,
  clearCachePath,
  clipboardWrite,
} from "../../utils";

function BoilerplateGenerator({
  state,
  showGenerator,
  setShowGenerator,
  form,
}) {
  const [spinning, setSpinning] = useState(false);
  const [tip, setTip] = useState("");
  const [showUpdate, setShowUpdate] = useState(false);
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
    setShowGenerator(false);
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
    sourceType,
    boilerplateName,
    repoBranch,
    sourceDir,
    repoUrl,
    ifArchiver,
    outDir,
  }) {
    const { definitions, "x-associations": associations = [] } = state;

    try {
      setSpinning(true);

      const { exists, outPath } = await checkPath([
        outDir,
        ifArchiver ? `${boilerplateName}.zip` : boilerplateName,
      ]);

      if (exists) {
        message.warning(`${ifArchiver ? "文件" : "文件夹"}已存在: ${outPath}`);
        setSpinning(false);
        return;
      }

      if (sourceType === "defaultOnline" || sourceType === "customOnline") {
        setTip("下载样板...");
        await downloadBoilerplate(boilerplateName, repoUrl, repoBranch);
      }
      setTip("渲染模板...");
      await generateBoilerplate(boilerplateName, {
        definitions,
        dataFormats,
        sourceType,
        sourceDir,
        yamlData: yaml.dump(state),
        associations,
      });
      if (ifArchiver) {
        setTip("打包文件...");
        await archiverBoilerplate(boilerplateName, outDir);
      } else {
        setTip("复制文件...");
        await copyBoilerplate(boilerplateName, outDir);
      }
      message.success("生成成功!");
      setTip("清空临时文件...");
      await clearCachePath();
    } catch (err) {
      console.log(err);
      message.error(err.message || "生成失败!");
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
      title="Boilerplate Generator"
      placement="right"
      width="60%"
      onClose={handleHide}
      visible={showGenerator}
      destroyOnClose
    >
      <Spin tip={tip} spinning={spinning}>
        <Form {...formItemLayout} onSubmit={handleSubmit}>
          <Form.Item label="样板来源">
            {getFieldDecorator("sourceType", {
              rules: [
                {
                  required: true,
                  message: "请选择!",
                },
              ],
            })(
              <Radio.Group
                onChange={() => {
                  setFieldsValue({ boilerplateName: undefined });
                }}
              >
                <Radio.Button value="defaultLocal">Local</Radio.Button>
                <Radio.Button value="defaultOnline">Online</Radio.Button>
                <Radio.Button value="customLocal">Custom Local</Radio.Button>
                <Radio.Button value="customOnline">Custom Online</Radio.Button>
              </Radio.Group>
            )}
          </Form.Item>

          {getFieldValue("sourceType") === "defaultLocal" && (
            <Form.Item label="选择项目">
              {getFieldDecorator("boilerplateName", {
                rules: [
                  {
                    required: true,
                    message: "请选择!",
                  },
                ],
              })(
                <Radio.Group>
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
          )}

          {getFieldValue("sourceType") === "defaultOnline" && (
            <Fragment>
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
            </Fragment>
          )}

          {getFieldValue("sourceType") === "customLocal" && (
            <Fragment>
              <Form.Item label="样板目录">
                {getFieldDecorator("sourceDir", {
                  rules: [
                    {
                      required: true,
                      message: "请选择!",
                    },
                  ],
                })(<PathSelect />)}
              </Form.Item>
              <Form.Item label="项目名称" hasFeedback>
                {getFieldDecorator("boilerplateName", {
                  rules: [
                    {
                      required: true,
                      message: "请填写!",
                    },
                  ],
                })(<Input />)}
              </Form.Item>
            </Fragment>
          )}

          {getFieldValue("sourceType") === "customOnline" && (
            <Fragment>
              <Form.Item label="项目地址" hasFeedback>
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
                    placeholder="fishjar/koa-rest-boilerplate"
                  />
                )}
              </Form.Item>
              <Form.Item label="项目分支" hasFeedback>
                {getFieldDecorator("repoBranch", {
                  rules: [
                    {
                      required: true,
                      message: "请填写!",
                    },
                  ],
                })(<Input placeholder="master" />)}
              </Form.Item>
              <Form.Item label="项目名称" hasFeedback>
                {getFieldDecorator("boilerplateName", {
                  rules: [
                    {
                      required: true,
                      message: "请填写!",
                    },
                  ],
                })(<Input placeholder="koa" />)}
              </Form.Item>
            </Fragment>
          )}

          <Form.Item label="输出方式" required>
            {getFieldDecorator("ifArchiver", {
              initialValue: false,
              valuePropName: "checked",
            })(
              <Switch checkedChildren="打包输出" unCheckedChildren="直接输出" />
            )}
          </Form.Item>

          <Form.Item label="输出目录">
            {getFieldDecorator("outDir", {
              rules: [
                {
                  required: true,
                  message: "请选择!",
                },
              ],
            })(<PathSelect />)}
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
        <Button
          onClick={() => {
            setShowUpdate(true);
          }}
          style={{ marginRight: 8 }}
          type="dashed"
        >
          Local Bolierplate Update
        </Button>
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
      <BoilerplateUpdate
        showUpdate={showUpdate}
        setShowUpdate={setShowUpdate}
      />
    </Drawer>
  );
}

export default Form.create({ name: "boilerplateGenerator" })(
  BoilerplateGenerator
);
