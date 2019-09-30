# Swagger Go

通用、易用、强大、跨平台的可视化 Swagger 文档编辑及前后端代码生成工具。

# 技术栈

- Electron
- Swagger
- React
- Ant Design
- ejs

## 主要功能

- swagger 文档编辑(仅支持 2.0 版)
  - 提供样本 swagger 文档
  - 提供导入 swagger 功能
  - 可以导出 swagger 文档
- swagger 文档预览
  - swagger 源码预览
  - 集成 swagger UI
- 项目代码生成
  - 利用模板自动生成项目代码
  - 模板来源可以是本地或 Github
  - 包括但不限于 KOA、Ant Design Pro 等项目

## swagger 自定义字段说明

| field          | type          | path                    | notice                     |
| -------------- | ------------- | ----------------------- | -------------------------- |
| x-associations | boolean       | /                       | 模型关联列表               |
| x-auto         | boolean       | /paths/{path}/{method}/ | 是否自动生成的接口         |
| x-isModel      | boolean       | /definitions/{model}/   | 是否（数据库）模型         |
| x-plural       | string        | /definitions/{model}/   | 复数形式                   |
| x-tableName    | string        | /definitions/{model}/   | 表名                       |
| x-underscored  | boolean       | /definitions/{model}/   | 数据库字段是否用下划线写法 |
| x-paranoid     | boolean       | /definitions/{model}/   | 是否启用软删除             |
| x-tags         | array<string> | /definitions/{model}/   | 模型生成的接口的标签       |
| x-apis         | array<string> | /definitions/{model}/   | 模型的接口列表             |
| x-fieldName    | string        | ../properties/{field}/  | 自定义表中字段名           |
| x-primaryKey   | boolean       | ../properties/{field}/  | 是否主键                   |
| x-message      | string        | ../properties/{field}/  | 表单填写提示语             |
| x-showTable    | boolean       | ../properties/{field}/  | 数据是否显示在后台列表中   |
| x-showFilter   | boolean       | ../properties/{field}/  | 是否在列表上部搜索过滤     |
| x-length       | number        | ../properties/{field}/  | string 字段长度            |
| x-enumMap      | map           | ../properties/{field}/  | 枚举类型的字典             |
| x-description  | text          | ../properties/{field}/  | 枚举类型的说明文字         |
| x-showSorter   | boolean       | ../properties/{field}/  | 列表中是否可排序           |
| x-isRichText   | boolean       | ../properties/{field}/  | 是否使用富文本编辑器       |
| x-increment    | boolean       | ../properties/{field}/  | 是否子增长字段             |

## 模板开发说明

### 目录示意图

```sh
├── swagger                 # 项目根目录下需要此文件夹
│   ├── config.json         # 必须的配置文件
│   ├── replace
│   │   └── initData.js
│   └── template
│       ├── handler.ejs
│       ├── handlerIndex.ejs
│       ├── model.ejs
│       ├── modelIndex.ejs
│       └── router.ejs
```

### 配置示例

```json
{
  "boilerplateLanguage": "nodejs",
  "templateEngine": "ejs",
  "globalFiles": [
    ["swagger/template/router.ejs", "src/router/index.js"],
    ["swagger/template/modelIndex.ejs", "src/model/index.js"],
    ["swagger/template/handlerIndex.ejs", "src/handler/index.js"]
  ],
  "modelFiles": [
    ["swagger/template/model.ejs", "src/model/*.js"],
    ["swagger/template/handler.ejs", "src/handler/*.js"]
  ],
  "replaceFiles": [["swagger/replace/initData.js", "src/utils/initData.js"]],
  "removeFiles": ["swagger/swagger.yaml"]
}
```

### 配置说明

```sh
"boilerplateLanguage"       # 项目使用的开发语言
"templateEngine"            # 使用的模板引擎
"globalFiles"               # 全部模型文件列表，对应一个文件
"modelFiles"                # 独立模型文件列表，对应多个（模型）文件，星号（*）会被模型名称代替
"replaceFiles"              # 需替换的文件列表
"removeFiles"               # 将删除的文件列表
```

- globalFiles 可使用对象：
  - definitions
  - dataFormats
  - associations
- modelFiles 可使用对象：
  - modelKey
  - model
  - definitions
  - dataFormats
  - associations
