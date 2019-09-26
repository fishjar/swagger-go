import React, { Fragment } from "react";
import FieldEdit from "./forms/FieldEdit";
import FieldCopy from "./forms/FieldCopy";
import { getModelProps, parseRef } from "../utils";
import { Icon, Button, Table, Divider, Badge } from "antd";

// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#schemaObject
export default function Definition({ models, model, dispatch }) {
  /**
   * 计算值
   * 将字段对象转为字段列表
   */
  const fields = Object.entries(model.properties || {}).map(([key, field]) => {
    // 外链模型
    const [refModel, refFields] = parseRef(
      models,
      field.$ref || field["x-ref"]
    );

    // 示例
    const example =
      field.example === undefined
        ? model.example && model.example[key]
        : field.example;

    // 对象类型
    const subFields = getModelProps(field);

    // 数组类型
    const arrayType =
      field.items && (field.items.$ref ? "ref" : field.items.type);
    const arrayRef = field.items && field.items.$ref;
    const [arrayModel, arrayFields] = parseRef(models, arrayRef);
    const arrayItemFields =
      arrayType === "object" ? getModelProps(field.items) : [];

    // 枚举类型
    const enumItems = Array.isArray(field.enum)
      ? field["x-enumMap"]
        ? Object.entries(field["x-enumMap"]).map(([k, v]) => ({
            key: field.type === "integer" ? ~~k : k,
            description: v,
          }))
        : field.enum.map(k => ({
            key: k,
            description: "",
          }))
      : [];

    return {
      ...field,
      example,
      refModel,
      refFields,
      arrayType,
      arrayRef,
      arrayModel,
      arrayFields,
      arrayItemFields,
      subFields,
      enumItems,
      isRef: !!field.$ref,
      isEnum: Array.isArray(field.enum),
      isRequired: (model.required || []).includes(key),
      isExample: Object.keys(model.example || {}).includes(key),
      key,
    };
  });

  /**
   * 删除字段
   * @param {String} fieldKey
   */
  function handleFieldRemove(fieldKey) {
    const { key, ...oldData } = model;
    const { properties = {}, required = [], example = {} } = oldData;

    delete properties[fieldKey];
    delete example[fieldKey];

    dispatch({
      type: "MODEL_UPDATE",
      payload: {
        [key]: {
          ...oldData,
          required: required.filter(item => item !== fieldKey),
          example,
          properties,
        },
      },
    });
  }

  const columns = [
    {
      title: "[Unique]Index",
      dataIndex: "index",
      render: (_, record, index) => {
        return (
          <Badge
            status={record.uniqueItems ? "success" : "default"}
            text={index + 1}
          />
        );
      },
    },
    {
      title: "Field",
      dataIndex: "key",
      render: (text, record) => {
        return (
          <div>
            <div>{text}</div>
            {record["x-fieldName"] && record["x-fieldName"] !== text && (
              <div style={{ color: "#999" }}>{record["x-fieldName"]}</div>
            )}
          </div>
        );
      },
    },
    {
      title: "[Required] Type ( Format )",
      dataIndex: "format",
      render: (text, record) => {
        if (record.isRef) {
          return (
            <Badge
              status={record.isRequired ? "success" : "default"}
              text={`$ref ( ${record.refModel.key} )`}
            />
          );
        }
        return (
          <Badge
            status={record.isRequired ? "success" : "default"}
            text={
              `${record.type} ( ${text || ""} )` +
              `${record.isEnum ? " ( enum )" : ""}`
            }
          />
        );
      },
    },
    {
      title: "Placeholder - Description",
      dataIndex: "description",
      render: (text, record) => {
        if (record.$ref) {
          return (
            <div>
              <div>{`- ${record["x-description"] || ""}`}</div>
              <div>{`- ${record.refModel.description} ( ${record.refModel.key} )`}</div>
              {/* <ul style={{ margin: 0 }}>
                {record.refFields.map(({ key, type, description }) =>
                  key === record["x-refFieldKey"] ? (
                    <li key={key} style={{ color: "#52c41a" }}>
                      {type} - {key} ({description})
                    </li>
                  ) : (
                    <li key={key}>
                      {type} - {key} ({description})
                    </li>
                  )
                )}
              </ul> */}
            </div>
          );
        } /* else if (record["x-foreignKey"]) {
          return (
            <div>
              <div>{`- ${record.description || ""}`}</div>
              <div>{`- ${record.refModel.description} ( ${record.refModel.key} )`}</div>
              <ul style={{ margin: 0 }}>
                {record.refFields.map(({ key, type, description }) =>
                  key === record["x-refFieldKey"] ? (
                    <li key={key} style={{ color: "#52c41a" }}>
                      {type} - {key} ({description})
                    </li>
                  ) : (
                    <li key={key}>
                      {type} - {key} ({description})
                    </li>
                  )
                )}
              </ul>
            </div>
          );
        } */ else if (
          record.isEnum
        ) {
          return (
            <div>
              <div>{`${record["x-message"] || ""} - ${
                record["x-description"]
              }`}</div>
              {/* <ul style={{ margin: 0 }}>
                {record.enumItems.map(({ key, description }) => (
                  <li key={key}>
                    {key} - {description}
                  </li>
                ))}
              </ul> */}
            </div>
          );
        } else if (record.format === "object") {
          return (
            <div>
              <div>{`${record["x-message"] || ""} - ${text}`}</div>
              {/* <ul style={{ margin: 0 }}>
                {record.subFields.map(({ key, type, description }) => (
                  <li key={key}>
                    {type} - {key} ({description})
                  </li>
                ))}
              </ul> */}
            </div>
          );
        } else if (record.format === "array") {
          if (record.arrayType === "ref") {
            return (
              <div>
                <div>{`${record["x-message"] || ""} - ${text}`}</div>
                <div>{`[ ${record.arrayType} - ${record.arrayModel.description} ( ${record.arrayModel.key} ) ]`}</div>
                {/* <ul style={{ margin: 0 }}>
                  {record.arrayFields.map(({ key, type, description }) => (
                    <li key={key}>
                      {type} - {key} ({description})
                    </li>
                  ))}
                </ul> */}
              </div>
            );
          } else if (record.arrayType === "object") {
            return (
              <div>
                <div>{`${record["x-message"] || ""} - ${text}`}</div>
                <div>{`[ ${record.arrayType} - ${record.description} ]`}</div>
                {/* <ul style={{ margin: 0 }}>
                  {record.arrayItemFields.map(({ key, type, description }) => (
                    <li key={key}>
                      {type} - {key} ({description})
                    </li>
                  ))}
                </ul> */}
              </div>
            );
          } else {
            return `${record["x-message"] || ""} - ${text} [ ${
              record.arrayType
            } ]`;
          }
        }
        return `${record["x-message"] || ""} - ${text || ""}`;
      },
    },
    {
      title: "Form",
      dataIndex: "x-showTable",
      render: (_, record) => (
        <div>
          {record["x-showTable"] && (
            <div>
              <Badge status="success" text="showTable" />
            </div>
          )}
          {record["x-showFilter"] && (
            <div>
              <Badge status="success" text="showFilter" />
            </div>
          )}
          {record["x-showSorter"] && (
            <div>
              <Badge status="success" text="showSorter" />
            </div>
          )}
          {record["x-isRichText"] && (
            <div>
              <Badge status="success" text="useRichText" />
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Default",
      dataIndex: "default",
      render: (_, record) => (
        <div>
          {record.default !== undefined && (
            <div>default: {record.default.toString()}</div>
          )}
          {record.minLength !== undefined && (
            <div>minLength: {record.minLength}</div>
          )}
          {record.maxLength !== undefined && (
            <div>maxLength: {record.maxLength}</div>
          )}
          {record.minimum !== undefined && <div>minimum: {record.minimum}</div>}
          {record.maximum !== undefined && <div>maximum: {record.maximum}</div>}
        </div>
      ),
    },
    {
      title: "Example",
      dataIndex: "example",
      render: (text, record) => (
        <Badge
          status={record.isExample ? "success" : "default"}
          text={JSON.stringify(text)}
        />
      ),
    },
    {
      title: "操作",
      render: (text, record) => (
        <span>
          <FieldEdit
            title="编辑"
            formMode="edit"
            dispatch={dispatch}
            models={models}
            model={model}
            fields={fields}
            field={record}
          >
            <Icon type="edit" />
          </FieldEdit>
          <Divider type="vertical" />
          <FieldCopy
            title="复制"
            formMode="copy"
            dispatch={dispatch}
            models={models}
            model={model}
            fields={fields}
            field={record}
          >
            <Icon type="copy" />
          </FieldCopy>
          <Divider type="vertical" />
          <Icon
            type="close"
            onClick={() => {
              handleFieldRemove(record.key);
            }}
          />
        </span>
      ),
    },
  ];

  return (
    <Fragment>
      {fields.length > 0 && (
        <Table
          columns={columns}
          bordered
          dataSource={fields}
          pagination={false}
          size="middle"
        />
      )}

      <FieldEdit
        title="新增"
        formMode="create"
        dispatch={dispatch}
        models={models}
        model={model}
        fields={fields}
      >
        <Button
          style={{
            width: "100%",
            marginTop: 16,
          }}
          type="dashed"
          icon="plus"
        >
          Add field
        </Button>
      </FieldEdit>
    </Fragment>
  );
}
