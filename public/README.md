# Swagger Go

通用、易用、强大、跨平台的可视化 Swagger 文档编辑及前后端代码生成工具。

## 技术栈

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

## 数据类型映射关系

| Common      | `type`    | `format`       | Mysql       | Sequelize     | SQLAlchemy              | gorm      |
| ----------- | --------- | -------------- | ----------- | ------------- | ----------------------- | --------- |
| integer     | `integer` | `int4`         | TINYINT     | TINYINT       | -                       | int       |
| integer     | `integer` | `int8`         | SMALLINT    | SMALLINT      | SMALLINT/SmallInteger   | int       |
| integer     | `integer` | `int16`        | MEDIUMINT   | MEDIUMINT     | -                       | int       |
| integer     | `integer` | `int32`        | INTEGER     | INTEGER       | Integer/INT/INTEGER     | int       |
| long        | `integer` | `int64`        | BIGINT      | BIGINT        | BigInteger/BIGINT       | int       |
| float       | `number`  | `float`        | FLOAT       | FLOAT         | Float/FLOAT             | float32   |
| double      | `number`  | `double`       | DOUBLE      | DOUBLE        | -                       | float32   |
| double      | `number`  | `decimal`      | DECIMAL     | DECIMAL       | DECIMAL/Numeric         | float32   |
| string      | `string`  | `char`         | CHAR        | CHAR          | String/CHAR             | string    |
| string      | `string`  | `string`       | VARCHAR     | STRING        | String/VARCHAR          | string    |
| string      | `string`  | `text`         | TEXT        | TEXT          | Text/TEXT/CLOB          | string    |
| date        | `string`  | `date`         | DATE        | DATEONLY      | Date/DATE               | time.Time |
| dateTime    | `string`  | `date-time`    | DATETIME    | DATE          | DateTime/DATETIME       | time.Time |
| dateTime    | `string`  | `date-time(6)` | DATETIME(6) | DATE(6)       | DateTime/DATETIME       | time.Time |
| dateTime    | `string`  | `time-stamp`   | TIMESTAMP   | -             | TIMESTAMP               | -         |
| email       | `string`  | `email`        | VARCHAR     | STRING        | VARCHAR                 | string    |
| uri         | `string`  | `uri`          | VARCHAR     | STRING        | VARCHAR                 | string    |
| uri         | `string`  | `hostname`     | VARCHAR     | STRING        | VARCHAR                 | string    |
| uri         | `string`  | `ipv4`         | VARCHAR     | STRING        | VARCHAR                 | string    |
| uri         | `string`  | `ipv6`         | VARCHAR     | STRING        | VARCHAR                 | string    |
| byte        | `string`  | `byte`         | VARCHAR     | STRING        | VARCHAR                 | string    |
| binary      | `string`  | `binary`       | BLOB/BINARY | STRING.BINARY | LargeBinary/BINARY/BLOB | -         |
| password    | `string`  | `password`     | VARCHAR     | STRING        | -                       | string    |
| uuid        | `string`  | `uuid`         | CHAR(36)    | UUID/UUIDV1   | -                       | string    |
| object/dict | `string`  | `json`         | JSON        | JSON          | JSON                    | string    |
| object/dict | `object`  | `object`       | JSON        | JSON          | JSON                    | string    |
| array       | `array`   | `array`        | JSON        | JSON          | ARRAY                   | string    |
| boolean     | `boolean` | `boolean`      | TINYINT(1)  | BOOLEAN       | Boolean/BOOLEAN         | bool      |
| enum        | \*        | `enum`         | ENUM        | ENUM          | Enum                    | -         |

## 开发及编译打包

```sh
# 安装依赖
yarn

# 开发
yarn dev

# 编译
yarn build

# 打包
yarn dist-linux # linux
yarn dist-windows # windows
```

编译好的文件下载：

- windows 版： `https://pan.baidu.com/s/1iGqJMy6gIjQjBMtmOlDWdg` 提取码: `1svx`
- linux 版： `https://pan.baidu.com/s/1s3KmmI8IqPCcUflY0ds7YA` 提取码: `cghn`

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
  "modelFilesCase": "pluralLower",
  "replaceFiles": [["swagger/replace/initData.js", "src/utils/initData.js"]],
  "modelReplaceFiles": [
    ["swagger/template/style.less", "src/pages/dashboard/*/style.less"]
  ],
  "removeFiles": ["swagger/swagger.yaml"]
}
```

### 配置说明

```sh
"boilerplateLanguage"       # 项目使用的开发语言
"templateEngine"            # 使用的模板引擎
"globalFiles"               # 全部模型文件列表，对应一个文件
"modelFiles"                # 独立模型文件列表，对应多个（模型）文件，默认星号（*）会被模型名称代替
"modelFilesCase"            # path的替换形式，可选值：default|lower|plural|pluralLower
"replaceFiles"              # 需替换的文件列表
"modelReplaceFiles"         # 去要替换的模型文件列表
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

## 更新记录

### v0.2.4(2020-02-05)

- 添加了`flask`模板
- 修改了`koa`模板

### v0.2.3(2019-11-06)

- 添加了`gin`后端接口模板
- 修复了生成代码时在线模式的小 bug

### v0.2.2(2019-10-23)

- 修复了预览时生成的`yaml`文件中`tags`包含类似`*ref_0`的 bug
- 增加了标题动态读取`package.json`中的版本号

### v0.2.1(2019-10-22)

- 添加了`antd`后台系统模板
- 修改了`koa`模板的一个小问题
- 模板配置文件新增`modelReplaceFiles`字段
