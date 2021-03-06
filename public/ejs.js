const data = {
  swagger: "2.0",
  info: {
    version: "0.1.0",
    title: "rest app",
    description: "rest boilerplate",
  },
  host: "localhost:4000",
  basePath: "/",
  schemes: ["http", "https"],
  consumes: ["application/json"],
  produces: ["application/json"],
  securityDefinitions: {
    JWT: {
      description: "Authorization: Bearer {token}",
      type: "apiKey",
      name: "Authorization",
      in: "header",
    },
  },
  tags: [
    {
      name: "default",
      description: "default description",
      externalDocs: {
        description: "Find out more",
        url: "http://swagger.io",
      },
    },
    {
      name: "user",
      description: "user description",
      externalDocs: {
        description: "Find out more",
        url: "http://swagger.io",
      },
    },
    {
      name: "auth",
      description: "auth description",
      externalDocs: {
        description: "Find out more",
        url: "http://swagger.io",
      },
    },
    {
      name: "role",
      description: "role description",
      externalDocs: {
        description: "Find out more",
        url: "http://swagger.io",
      },
    },
    {
      name: "menu",
      description: "menu description",
      externalDocs: {
        description: "Find out more",
        url: "http://swagger.io",
      },
    },
    {
      name: "group",
      description: "group description",
      externalDocs: {
        description: "Find out more",
        url: "http://swagger.io",
      },
    },
  ],
  paths: {
    "/login/account": {
      post: {
        tags: ["default"],
        summary: "登录",
        description: "登录...",
        security: [],
        parameters: [
          {
            in: "body",
            name: "body",
            description: "登录参数",
            required: true,
            schema: {
              $ref: "#/definitions/LoginBody",
            },
          },
        ],
        responses: {
          "200": {
            description: "登录成功",
            schema: {
              $ref: "#/definitions/LoginResponse",
            },
          },
          "401": {
            description: "登录失败",
            schema: {
              $ref: "#/definitions/Error",
            },
          },
        },
      },
    },
    "/user/current": {
      get: {
        tags: ["user"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "获取当前用户信息",
        description: "获取当前用户信息...",
        responses: {
          "200": {
            description: "查询成功",
            schema: {
              $ref: "#/definitions/User",
            },
          },
        },
      },
    },
    "/user/menus": {
      get: {
        tags: ["user"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "获取当前用户菜单",
        description: "获取当前用户菜单...",
        responses: {
          "200": {
            description: "查询成功",
            schema: {
              type: "array",
              items: {
                $ref: "#/definitions/Menu",
              },
            },
          },
        },
      },
    },
    "/user": {
      get: {
        "x-auto": true,
        tags: ["user"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "根据条件查找单个用户模型",
        description: "根据条件查找单个用户模型...",
        parameters: [
          {
            in: "query",
            name: "id",
            type: "string",
            description: "不限于id，可以是任意参数",
          },
        ],
        responses: {
          "200": {
            description: "查询成功",
            schema: {
              $ref: "#/definitions/User",
            },
          },
        },
      },
      post: {
        "x-auto": true,
        tags: ["user"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "查找或创建单个用户模型",
        description: "查找或创建单个用户模型...",
        parameters: [
          {
            in: "body",
            name: "body",
            description: "模型参数",
            required: true,
            schema: {
              $ref: "#/definitions/User",
            },
          },
        ],
        responses: {
          "200": {
            description: "创建成功",
            schema: {
              $ref: "#/definitions/User",
            },
          },
        },
      },
    },
    "/users": {
      get: {
        "x-auto": true,
        tags: ["user"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "查询多个用户模型",
        description: "查询多个用户模型...",
        parameters: [
          {
            in: "query",
            name: "pageNum",
            type: "integer",
            description: "页码",
            default: 1,
          },
          {
            in: "query",
            name: "pageSize",
            type: "integer",
            description: "分页大小",
            default: 10,
          },
          {
            in: "query",
            name: "sorter",
            type: "string",
            description: "排序",
          },
        ],
        responses: {
          "200": {
            description: "查询成功",
            schema: {
              type: "object",
              properties: {
                count: {
                  type: "integer",
                },
                rows: {
                  type: "array",
                  items: {
                    $ref: "#/definitions/User",
                  },
                },
              },
            },
          },
        },
      },
      post: {
        "x-auto": true,
        tags: ["user"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "创建单个用户模型",
        description: "创建单个用户模型...",
        parameters: [
          {
            in: "body",
            name: "body",
            description: "模型参数",
            required: true,
            schema: {
              $ref: "#/definitions/User",
            },
          },
        ],
        responses: {
          "200": {
            description: "创建成功",
          },
        },
      },
      patch: {
        "x-auto": true,
        tags: ["user"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "更新多个用户模型",
        description: "更新多个用户模型...",
        parameters: [
          {
            in: "body",
            name: "body",
            description: "模型参数",
            required: true,
            schema: {
              $ref: "#/definitions/User",
            },
          },
          {
            in: "query",
            name: "id",
            required: true,
            type: "array",
            description: "ID",
            items: {
              type: "string",
            },
            collectionFormat: "multi",
          },
        ],
        responses: {
          "200": {
            description: "更新成功",
          },
        },
      },
      delete: {
        "x-auto": true,
        tags: ["user"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "删除多个用户模型",
        description: "删除多个用户模型...",
        parameters: [
          {
            in: "query",
            name: "id",
            required: true,
            type: "array",
            description: "ID",
            items: {
              type: "string",
            },
            collectionFormat: "multi",
          },
        ],
        responses: {
          "200": {
            description: "更新成功",
          },
        },
      },
    },
    "/users/:id": {
      get: {
        "x-auto": true,
        tags: ["user"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "查询单个用户模型",
        description: "查询单个用户模型..",
        parameters: [
          {
            in: "path",
            name: "id",
            type: "string",
            required: true,
            description: "ID",
          },
        ],
        responses: {
          "200": {
            description: "查询成功",
            schema: {
              $ref: "#/definitions/User",
            },
          },
        },
      },
      patch: {
        "x-auto": true,
        tags: ["user"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "修改单个用户模型",
        description: "修改单个用户模型..",
        parameters: [
          {
            in: "path",
            name: "id",
            type: "string",
            required: true,
            description: "ID",
          },
          {
            in: "body",
            name: "body",
            description: "模型参数",
            required: true,
            schema: {
              $ref: "#/definitions/User",
            },
          },
        ],
        responses: {
          "200": {
            description: "修改成功",
          },
        },
      },
      delete: {
        "x-auto": true,
        tags: ["user"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "删除单个用户模型",
        description: "删除单个用户模型..",
        parameters: [
          {
            in: "path",
            name: "id",
            type: "string",
            required: true,
            description: "ID",
          },
        ],
        responses: {
          "200": {
            description: "删除成功",
          },
        },
      },
    },
    "/users/multiple": {
      post: {
        "x-auto": true,
        tags: ["user"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "创建多个用户模型",
        description: "创建多个用户模型...",
        parameters: [
          {
            in: "body",
            name: "body",
            description: "body参数",
            schema: {
              type: "array",
              items: {
                $ref: "#/definitions/User",
              },
            },
          },
        ],
        responses: {
          "200": {
            description: "创建成功",
          },
        },
      },
    },
    "/auth": {
      get: {
        "x-auto": true,
        tags: ["auth"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "根据条件查找单个鉴权模型",
        description: "根据条件查找单个鉴权模型...",
        parameters: [
          {
            in: "query",
            name: "id",
            type: "string",
            description: "不限于id，可以是任意参数",
          },
        ],
        responses: {
          "200": {
            description: "查询成功",
            schema: {
              $ref: "#/definitions/Auth",
            },
          },
        },
      },
      post: {
        "x-auto": true,
        tags: ["auth"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "查找或创建单个鉴权模型",
        description: "查找或创建单个鉴权模型...",
        parameters: [
          {
            in: "body",
            name: "body",
            description: "模型参数",
            required: true,
            schema: {
              $ref: "#/definitions/Auth",
            },
          },
        ],
        responses: {
          "200": {
            description: "创建成功",
            schema: {
              $ref: "#/definitions/Auth",
            },
          },
        },
      },
    },
    "/auths": {
      get: {
        "x-auto": true,
        tags: ["auth"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "查询多个鉴权模型",
        description: "查询多个鉴权模型...",
        parameters: [
          {
            in: "query",
            name: "pageNum",
            type: "integer",
            description: "页码",
            default: 1,
          },
          {
            in: "query",
            name: "pageSize",
            type: "integer",
            description: "分页大小",
            default: 10,
          },
          {
            in: "query",
            name: "sorter",
            type: "string",
            description: "排序",
          },
        ],
        responses: {
          "200": {
            description: "查询成功",
            schema: {
              type: "object",
              properties: {
                count: {
                  type: "integer",
                },
                rows: {
                  type: "array",
                  items: {
                    $ref: "#/definitions/Auth",
                  },
                },
              },
            },
          },
        },
      },
      post: {
        "x-auto": true,
        tags: ["auth"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "创建单个鉴权模型",
        description: "创建单个鉴权模型...",
        parameters: [
          {
            in: "body",
            name: "body",
            description: "模型参数",
            required: true,
            schema: {
              $ref: "#/definitions/Auth",
            },
          },
        ],
        responses: {
          "200": {
            description: "创建成功",
          },
        },
      },
      patch: {
        "x-auto": true,
        tags: ["auth"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "更新多个鉴权模型",
        description: "更新多个鉴权模型...",
        parameters: [
          {
            in: "body",
            name: "body",
            description: "模型参数",
            required: true,
            schema: {
              $ref: "#/definitions/Auth",
            },
          },
          {
            in: "query",
            name: "id",
            required: true,
            type: "array",
            description: "ID",
            items: {
              type: "string",
            },
            collectionFormat: "multi",
          },
        ],
        responses: {
          "200": {
            description: "更新成功",
          },
        },
      },
      delete: {
        "x-auto": true,
        tags: ["auth"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "删除多个鉴权模型",
        description: "删除多个鉴权模型...",
        parameters: [
          {
            in: "query",
            name: "id",
            required: true,
            type: "array",
            description: "ID",
            items: {
              type: "string",
            },
            collectionFormat: "multi",
          },
        ],
        responses: {
          "200": {
            description: "更新成功",
          },
        },
      },
    },
    "/auths/:id": {
      get: {
        "x-auto": true,
        tags: ["auth"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "查询单个鉴权模型",
        description: "查询单个鉴权模型..",
        parameters: [
          {
            in: "path",
            name: "id",
            type: "string",
            required: true,
            description: "ID",
          },
        ],
        responses: {
          "200": {
            description: "查询成功",
            schema: {
              $ref: "#/definitions/Auth",
            },
          },
        },
      },
      patch: {
        "x-auto": true,
        tags: ["auth"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "修改单个鉴权模型",
        description: "修改单个鉴权模型..",
        parameters: [
          {
            in: "path",
            name: "id",
            type: "string",
            required: true,
            description: "ID",
          },
          {
            in: "body",
            name: "body",
            description: "模型参数",
            required: true,
            schema: {
              $ref: "#/definitions/Auth",
            },
          },
        ],
        responses: {
          "200": {
            description: "修改成功",
          },
        },
      },
      delete: {
        "x-auto": true,
        tags: ["auth"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "删除单个鉴权模型",
        description: "删除单个鉴权模型..",
        parameters: [
          {
            in: "path",
            name: "id",
            type: "string",
            required: true,
            description: "ID",
          },
        ],
        responses: {
          "200": {
            description: "删除成功",
          },
        },
      },
    },
    "/auths/multiple": {
      post: {
        "x-auto": true,
        tags: ["auth"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "创建多个鉴权模型",
        description: "创建多个鉴权模型...",
        parameters: [
          {
            in: "body",
            name: "body",
            description: "body参数",
            schema: {
              type: "array",
              items: {
                $ref: "#/definitions/Auth",
              },
            },
          },
        ],
        responses: {
          "200": {
            description: "创建成功",
          },
        },
      },
    },
    "/role": {
      get: {
        "x-auto": true,
        tags: ["role"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "根据条件查找单个角色模型",
        description: "根据条件查找单个角色模型...",
        parameters: [
          {
            in: "query",
            name: "id",
            type: "string",
            description: "不限于id，可以是任意参数",
          },
        ],
        responses: {
          "200": {
            description: "查询成功",
            schema: {
              $ref: "#/definitions/Role",
            },
          },
        },
      },
      post: {
        "x-auto": true,
        tags: ["role"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "查找或创建单个角色模型",
        description: "查找或创建单个角色模型...",
        parameters: [
          {
            in: "body",
            name: "body",
            description: "模型参数",
            required: true,
            schema: {
              $ref: "#/definitions/Role",
            },
          },
        ],
        responses: {
          "200": {
            description: "创建成功",
            schema: {
              $ref: "#/definitions/Role",
            },
          },
        },
      },
    },
    "/roles": {
      get: {
        "x-auto": true,
        tags: ["role"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "查询多个角色模型",
        description: "查询多个角色模型...",
        parameters: [
          {
            in: "query",
            name: "pageNum",
            type: "integer",
            description: "页码",
            default: 1,
          },
          {
            in: "query",
            name: "pageSize",
            type: "integer",
            description: "分页大小",
            default: 10,
          },
          {
            in: "query",
            name: "sorter",
            type: "string",
            description: "排序",
          },
        ],
        responses: {
          "200": {
            description: "查询成功",
            schema: {
              type: "object",
              properties: {
                count: {
                  type: "integer",
                },
                rows: {
                  type: "array",
                  items: {
                    $ref: "#/definitions/Role",
                  },
                },
              },
            },
          },
        },
      },
      post: {
        "x-auto": true,
        tags: ["role"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "创建单个角色模型",
        description: "创建单个角色模型...",
        parameters: [
          {
            in: "body",
            name: "body",
            description: "模型参数",
            required: true,
            schema: {
              $ref: "#/definitions/Role",
            },
          },
        ],
        responses: {
          "200": {
            description: "创建成功",
          },
        },
      },
      patch: {
        "x-auto": true,
        tags: ["role"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "更新多个角色模型",
        description: "更新多个角色模型...",
        parameters: [
          {
            in: "body",
            name: "body",
            description: "模型参数",
            required: true,
            schema: {
              $ref: "#/definitions/Role",
            },
          },
          {
            in: "query",
            name: "id",
            required: true,
            type: "array",
            description: "ID",
            items: {
              type: "string",
            },
            collectionFormat: "multi",
          },
        ],
        responses: {
          "200": {
            description: "更新成功",
          },
        },
      },
      delete: {
        "x-auto": true,
        tags: ["role"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "删除多个角色模型",
        description: "删除多个角色模型...",
        parameters: [
          {
            in: "query",
            name: "id",
            required: true,
            type: "array",
            description: "ID",
            items: {
              type: "string",
            },
            collectionFormat: "multi",
          },
        ],
        responses: {
          "200": {
            description: "更新成功",
          },
        },
      },
    },
    "/roles/:id": {
      get: {
        "x-auto": true,
        tags: ["role"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "查询单个角色模型",
        description: "查询单个角色模型..",
        parameters: [
          {
            in: "path",
            name: "id",
            type: "string",
            required: true,
            description: "ID",
          },
        ],
        responses: {
          "200": {
            description: "查询成功",
            schema: {
              $ref: "#/definitions/Role",
            },
          },
        },
      },
      patch: {
        "x-auto": true,
        tags: ["role"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "修改单个角色模型",
        description: "修改单个角色模型..",
        parameters: [
          {
            in: "path",
            name: "id",
            type: "string",
            required: true,
            description: "ID",
          },
          {
            in: "body",
            name: "body",
            description: "模型参数",
            required: true,
            schema: {
              $ref: "#/definitions/Role",
            },
          },
        ],
        responses: {
          "200": {
            description: "修改成功",
          },
        },
      },
      delete: {
        "x-auto": true,
        tags: ["role"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "删除单个角色模型",
        description: "删除单个角色模型..",
        parameters: [
          {
            in: "path",
            name: "id",
            type: "string",
            required: true,
            description: "ID",
          },
        ],
        responses: {
          "200": {
            description: "删除成功",
          },
        },
      },
    },
    "/roles/multiple": {
      post: {
        "x-auto": true,
        tags: ["role"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "创建多个角色模型",
        description: "创建多个角色模型...",
        parameters: [
          {
            in: "body",
            name: "body",
            description: "body参数",
            schema: {
              type: "array",
              items: {
                $ref: "#/definitions/Role",
              },
            },
          },
        ],
        responses: {
          "200": {
            description: "创建成功",
          },
        },
      },
    },
    "/menu": {
      get: {
        "x-auto": true,
        tags: ["menu"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "根据条件查找单个菜单模型",
        description: "根据条件查找单个菜单模型...",
        parameters: [
          {
            in: "query",
            name: "id",
            type: "string",
            description: "不限于id，可以是任意参数",
          },
        ],
        responses: {
          "200": {
            description: "查询成功",
            schema: {
              $ref: "#/definitions/Menu",
            },
          },
        },
      },
      post: {
        "x-auto": true,
        tags: ["menu"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "查找或创建单个菜单模型",
        description: "查找或创建单个菜单模型...",
        parameters: [
          {
            in: "body",
            name: "body",
            description: "模型参数",
            required: true,
            schema: {
              $ref: "#/definitions/Menu",
            },
          },
        ],
        responses: {
          "200": {
            description: "创建成功",
            schema: {
              $ref: "#/definitions/Menu",
            },
          },
        },
      },
    },
    "/menus": {
      get: {
        "x-auto": true,
        tags: ["menu"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "查询多个菜单模型",
        description: "查询多个菜单模型...",
        parameters: [
          {
            in: "query",
            name: "pageNum",
            type: "integer",
            description: "页码",
            default: 1,
          },
          {
            in: "query",
            name: "pageSize",
            type: "integer",
            description: "分页大小",
            default: 10,
          },
          {
            in: "query",
            name: "sorter",
            type: "string",
            description: "排序",
          },
        ],
        responses: {
          "200": {
            description: "查询成功",
            schema: {
              type: "object",
              properties: {
                count: {
                  type: "integer",
                },
                rows: {
                  type: "array",
                  items: {
                    $ref: "#/definitions/Menu",
                  },
                },
              },
            },
          },
        },
      },
      post: {
        "x-auto": true,
        tags: ["menu"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "创建单个菜单模型",
        description: "创建单个菜单模型...",
        parameters: [
          {
            in: "body",
            name: "body",
            description: "模型参数",
            required: true,
            schema: {
              $ref: "#/definitions/Menu",
            },
          },
        ],
        responses: {
          "200": {
            description: "创建成功",
          },
        },
      },
      patch: {
        "x-auto": true,
        tags: ["menu"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "更新多个菜单模型",
        description: "更新多个菜单模型...",
        parameters: [
          {
            in: "body",
            name: "body",
            description: "模型参数",
            required: true,
            schema: {
              $ref: "#/definitions/Menu",
            },
          },
          {
            in: "query",
            name: "id",
            required: true,
            type: "array",
            description: "ID",
            items: {
              type: "string",
            },
            collectionFormat: "multi",
          },
        ],
        responses: {
          "200": {
            description: "更新成功",
          },
        },
      },
      delete: {
        "x-auto": true,
        tags: ["menu"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "删除多个菜单模型",
        description: "删除多个菜单模型...",
        parameters: [
          {
            in: "query",
            name: "id",
            required: true,
            type: "array",
            description: "ID",
            items: {
              type: "string",
            },
            collectionFormat: "multi",
          },
        ],
        responses: {
          "200": {
            description: "更新成功",
          },
        },
      },
    },
    "/menus/:id": {
      get: {
        "x-auto": true,
        tags: ["menu"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "查询单个菜单模型",
        description: "查询单个菜单模型..",
        parameters: [
          {
            in: "path",
            name: "id",
            type: "string",
            required: true,
            description: "ID",
          },
        ],
        responses: {
          "200": {
            description: "查询成功",
            schema: {
              $ref: "#/definitions/Menu",
            },
          },
        },
      },
      patch: {
        "x-auto": true,
        tags: ["menu"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "修改单个菜单模型",
        description: "修改单个菜单模型..",
        parameters: [
          {
            in: "path",
            name: "id",
            type: "string",
            required: true,
            description: "ID",
          },
          {
            in: "body",
            name: "body",
            description: "模型参数",
            required: true,
            schema: {
              $ref: "#/definitions/Menu",
            },
          },
        ],
        responses: {
          "200": {
            description: "修改成功",
          },
        },
      },
      delete: {
        "x-auto": true,
        tags: ["menu"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "删除单个菜单模型",
        description: "删除单个菜单模型..",
        parameters: [
          {
            in: "path",
            name: "id",
            type: "string",
            required: true,
            description: "ID",
          },
        ],
        responses: {
          "200": {
            description: "删除成功",
          },
        },
      },
    },
    "/menus/multiple": {
      post: {
        "x-auto": true,
        tags: ["menu"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "创建多个菜单模型",
        description: "创建多个菜单模型...",
        parameters: [
          {
            in: "body",
            name: "body",
            description: "body参数",
            schema: {
              type: "array",
              items: {
                $ref: "#/definitions/Menu",
              },
            },
          },
        ],
        responses: {
          "200": {
            description: "创建成功",
          },
        },
      },
    },
    "/group": {
      get: {
        "x-auto": true,
        tags: ["group"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "根据条件查找单个组模型",
        description: "根据条件查找单个组模型...",
        parameters: [
          {
            in: "query",
            name: "id",
            type: "string",
            description: "不限于id，可以是任意参数",
          },
        ],
        responses: {
          "200": {
            description: "查询成功",
            schema: {
              $ref: "#/definitions/Group",
            },
          },
        },
      },
      post: {
        "x-auto": true,
        tags: ["group"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "查找或创建单个组模型",
        description: "查找或创建单个组模型...",
        parameters: [
          {
            in: "body",
            name: "body",
            description: "模型参数",
            required: true,
            schema: {
              $ref: "#/definitions/Group",
            },
          },
        ],
        responses: {
          "200": {
            description: "创建成功",
            schema: {
              $ref: "#/definitions/Group",
            },
          },
        },
      },
    },
    "/groups": {
      get: {
        "x-auto": true,
        tags: ["group"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "查询多个组模型",
        description: "查询多个组模型...",
        parameters: [
          {
            in: "query",
            name: "pageNum",
            type: "integer",
            description: "页码",
            default: 1,
          },
          {
            in: "query",
            name: "pageSize",
            type: "integer",
            description: "分页大小",
            default: 10,
          },
          {
            in: "query",
            name: "sorter",
            type: "string",
            description: "排序",
          },
        ],
        responses: {
          "200": {
            description: "查询成功",
            schema: {
              type: "object",
              properties: {
                count: {
                  type: "integer",
                },
                rows: {
                  type: "array",
                  items: {
                    $ref: "#/definitions/Group",
                  },
                },
              },
            },
          },
        },
      },
      post: {
        "x-auto": true,
        tags: ["group"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "创建单个组模型",
        description: "创建单个组模型...",
        parameters: [
          {
            in: "body",
            name: "body",
            description: "模型参数",
            required: true,
            schema: {
              $ref: "#/definitions/Group",
            },
          },
        ],
        responses: {
          "200": {
            description: "创建成功",
          },
        },
      },
      patch: {
        "x-auto": true,
        tags: ["group"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "更新多个组模型",
        description: "更新多个组模型...",
        parameters: [
          {
            in: "body",
            name: "body",
            description: "模型参数",
            required: true,
            schema: {
              $ref: "#/definitions/Group",
            },
          },
          {
            in: "query",
            name: "id",
            required: true,
            type: "array",
            description: "ID",
            items: {
              type: "string",
            },
            collectionFormat: "multi",
          },
        ],
        responses: {
          "200": {
            description: "更新成功",
          },
        },
      },
      delete: {
        "x-auto": true,
        tags: ["group"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "删除多个组模型",
        description: "删除多个组模型...",
        parameters: [
          {
            in: "query",
            name: "id",
            required: true,
            type: "array",
            description: "ID",
            items: {
              type: "string",
            },
            collectionFormat: "multi",
          },
        ],
        responses: {
          "200": {
            description: "更新成功",
          },
        },
      },
    },
    "/groups/:id": {
      get: {
        "x-auto": true,
        tags: ["group"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "查询单个组模型",
        description: "查询单个组模型..",
        parameters: [
          {
            in: "path",
            name: "id",
            type: "string",
            required: true,
            description: "ID",
          },
        ],
        responses: {
          "200": {
            description: "查询成功",
            schema: {
              $ref: "#/definitions/Group",
            },
          },
        },
      },
      patch: {
        "x-auto": true,
        tags: ["group"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "修改单个组模型",
        description: "修改单个组模型..",
        parameters: [
          {
            in: "path",
            name: "id",
            type: "string",
            required: true,
            description: "ID",
          },
          {
            in: "body",
            name: "body",
            description: "模型参数",
            required: true,
            schema: {
              $ref: "#/definitions/Group",
            },
          },
        ],
        responses: {
          "200": {
            description: "修改成功",
          },
        },
      },
      delete: {
        "x-auto": true,
        tags: ["group"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "删除单个组模型",
        description: "删除单个组模型..",
        parameters: [
          {
            in: "path",
            name: "id",
            type: "string",
            required: true,
            description: "ID",
          },
        ],
        responses: {
          "200": {
            description: "删除成功",
          },
        },
      },
    },
    "/groups/multiple": {
      post: {
        "x-auto": true,
        tags: ["group"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "创建多个组模型",
        description: "创建多个组模型...",
        parameters: [
          {
            in: "body",
            name: "body",
            description: "body参数",
            schema: {
              type: "array",
              items: {
                $ref: "#/definitions/Group",
              },
            },
          },
        ],
        responses: {
          "200": {
            description: "创建成功",
          },
        },
      },
    },
    "/usergroups": {
      get: {
        "x-auto": true,
        tags: ["user", "group"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "查询多个用户-组模型",
        description: "查询多个用户-组模型...",
        parameters: [
          {
            in: "query",
            name: "pageNum",
            type: "integer",
            description: "页码",
            default: 1,
          },
          {
            in: "query",
            name: "pageSize",
            type: "integer",
            description: "分页大小",
            default: 10,
          },
          {
            in: "query",
            name: "sorter",
            type: "string",
            description: "排序",
          },
        ],
        responses: {
          "200": {
            description: "查询成功",
            schema: {
              type: "object",
              properties: {
                count: {
                  type: "integer",
                },
                rows: {
                  type: "array",
                  items: {
                    $ref: "#/definitions/UserGroup",
                  },
                },
              },
            },
          },
        },
      },
      post: {
        "x-auto": true,
        tags: ["user", "group"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "创建单个用户-组模型",
        description: "创建单个用户-组模型...",
        parameters: [
          {
            in: "body",
            name: "body",
            description: "模型参数",
            required: true,
            schema: {
              $ref: "#/definitions/UserGroup",
            },
          },
        ],
        responses: {
          "200": {
            description: "创建成功",
          },
        },
      },
      patch: {
        "x-auto": true,
        tags: ["user", "group"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "更新多个用户-组模型",
        description: "更新多个用户-组模型...",
        parameters: [
          {
            in: "body",
            name: "body",
            description: "模型参数",
            required: true,
            schema: {
              $ref: "#/definitions/UserGroup",
            },
          },
          {
            in: "query",
            name: "id",
            required: true,
            type: "array",
            description: "ID",
            items: {
              type: "string",
            },
            collectionFormat: "multi",
          },
        ],
        responses: {
          "200": {
            description: "更新成功",
          },
        },
      },
      delete: {
        "x-auto": true,
        tags: ["user", "group"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "删除多个用户-组模型",
        description: "删除多个用户-组模型...",
        parameters: [
          {
            in: "query",
            name: "id",
            required: true,
            type: "array",
            description: "ID",
            items: {
              type: "string",
            },
            collectionFormat: "multi",
          },
        ],
        responses: {
          "200": {
            description: "更新成功",
          },
        },
      },
    },
    "/usergroups/:id": {
      get: {
        "x-auto": true,
        tags: ["user", "group"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "查询单个用户-组模型",
        description: "查询单个用户-组模型..",
        parameters: [
          {
            in: "path",
            name: "id",
            type: "string",
            required: true,
            description: "ID",
          },
        ],
        responses: {
          "200": {
            description: "查询成功",
            schema: {
              $ref: "#/definitions/UserGroup",
            },
          },
        },
      },
      patch: {
        "x-auto": true,
        tags: ["user", "group"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "修改单个用户-组模型",
        description: "修改单个用户-组模型..",
        parameters: [
          {
            in: "path",
            name: "id",
            type: "string",
            required: true,
            description: "ID",
          },
          {
            in: "body",
            name: "body",
            description: "模型参数",
            required: true,
            schema: {
              $ref: "#/definitions/UserGroup",
            },
          },
        ],
        responses: {
          "200": {
            description: "修改成功",
          },
        },
      },
      delete: {
        "x-auto": true,
        tags: ["user", "group"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "删除单个用户-组模型",
        description: "删除单个用户-组模型..",
        parameters: [
          {
            in: "path",
            name: "id",
            type: "string",
            required: true,
            description: "ID",
          },
        ],
        responses: {
          "200": {
            description: "删除成功",
          },
        },
      },
    },
    "/usergroups/multiple": {
      post: {
        "x-auto": true,
        tags: ["user", "group"],
        security: [
          {
            JWT: [],
          },
        ],
        summary: "创建多个用户-组模型",
        description: "创建多个用户-组模型...",
        parameters: [
          {
            in: "body",
            name: "body",
            description: "body参数",
            schema: {
              type: "array",
              items: {
                $ref: "#/definitions/UserGroup",
              },
            },
          },
        ],
        responses: {
          "200": {
            description: "创建成功",
          },
        },
      },
    },
  },
  definitions: {
    User: {
      type: "object",
      description: "用户模型",
      "x-isModel": true,
      "x-plural": "Users",
      "x-tableName": "user",
      "x-underscored": true,
      "x-paranoid": true,
      "x-tags": ["user"],
      "x-apis": [
        "findAndCountAll",
        "findByPk",
        "singleCreate",
        "bulkCreate",
        "bulkUpdate",
        "updateByPk",
        "bulkDestroy",
        "destroyByPk",
        "findOne",
        "findOrCreate",
      ],
      required: ["id", "name"],
      properties: {
        id: {
          type: "string",
          format: "uuid",
          description: "ID",
          uniqueItems: true,
          example: "fc3c286e-78b3-490b-be6a-79a6069fd68e",
          "x-fieldName": "id",
          "x-primaryKey": true,
        },
        name: {
          type: "string",
          format: "string",
          description: "名称",
          example: "gabe",
          minLength: 3,
          maxLength: 20,
          "x-fieldName": "name",
          "x-message": "请输入",
          "x-showTable": true,
          "x-showFilter": true,
          "x-length": 32,
        },
        nickname: {
          type: "string",
          format: "string",
          description: "昵称",
          "x-fieldName": "nickname",
          "x-message": "请输入",
          "x-length": 64,
        },
        gender: {
          type: "integer",
          format: "int4",
          enum: [0, 1, 2],
          "x-message": "请选择",
          "x-showTable": true,
          "x-showFilter": true,
          "x-fieldName": "gender",
          "x-enumMap": {
            "0": "保密",
            "1": "男",
            "2": "女",
          },
          "x-description": "性别",
          description: "'性别'\n  * 0 - 保密\n  * 1 - 男\n  * 2 - 女\n",
        },
        avatar: {
          type: "string",
          format: "string",
          description: "头像",
          "x-fieldName": "avatar",
          "x-message": "请输入",
        },
        mobile: {
          type: "string",
          format: "string",
          description: "手机",
          "x-fieldName": "mobile",
          "x-message": "请输入",
          "x-length": 16,
        },
        email: {
          type: "string",
          format: "email",
          description: "邮箱",
          "x-fieldName": "email",
          "x-message": "请输入",
        },
        homepage: {
          type: "string",
          format: "uri",
          description: "主页",
          "x-fieldName": "homepage",
          "x-message": "请输入",
        },
        birthday: {
          type: "string",
          format: "date",
          description: "生日",
          "x-fieldName": "birthday",
          "x-message": "请选择",
          "x-showTable": true,
          "x-showSorter": true,
        },
        height: {
          type: "number",
          format: "float",
          description: "身高(cm)",
          minimum: 0.01,
          maximum: 250,
          "x-fieldName": "height",
          "x-message": "请输入",
          "x-showTable": true,
          "x-showSorter": true,
        },
        bloodType: {
          type: "string",
          format: "string",
          enum: ["A", "B", "AB", "O", "NULL"],
          "x-message": "请选择",
          "x-fieldName": "blood_type",
          "x-enumMap": {
            A: "A",
            B: "B",
            AB: "AB",
            O: "O",
            NULL: "保密",
          },
          "x-description": "血型(ABO)",
          description:
            "'血型(ABO)'\n  * A - A型\n  * B - B型\n  * AB - AB型\n  * O - O型\n  * NULL - 保密\n",
        },
        notice: {
          type: "string",
          format: "text",
          description: "备注",
          "x-fieldName": "notice",
          "x-message": "请输入",
        },
        intro: {
          type: "string",
          format: "text",
          description: "介绍",
          "x-fieldName": "intro",
          "x-message": "请输入",
          "x-isRichText": true,
        },
        address: {
          type: "object",
          format: "object",
          description: "地址",
          "x-fieldName": "address",
          "x-message": "请输入",
          properties: {
            province: {
              type: "string",
              description: "省",
            },
            city: {
              type: "string",
              description: "市",
            },
          },
        },
        lives: {
          type: "array",
          format: "array",
          description: "生活轨迹",
          "x-fieldName": "lives",
          items: {
            type: "object",
            properties: {
              x: {
                type: "string",
                description: "x坐标",
              },
              y: {
                type: "string",
                description: "y坐标",
              },
            },
          },
        },
        roles: {
          type: "array",
          format: "array",
          description: "角色",
          "x-fieldName": "roles",
          items: {
            $ref: "#/definitions/Role",
          },
        },
        groups: {
          type: "array",
          format: "array",
          description: "组",
          "x-fieldName": "groups",
          items: {
            $ref: "#/definitions/Group",
          },
        },
        friends: {
          type: "array",
          format: "array",
          description: "朋友",
          "x-fieldName": "friends",
          items: {
            $ref: "#/definitions/User",
          },
        },
        tags: {
          type: "array",
          format: "array",
          description: "标签",
          "x-fieldName": "tags",
          items: {
            type: "string",
          },
        },
        luckyNumbers: {
          type: "array",
          format: "array",
          description: "幸运数字",
          "x-fieldName": "lucky_numbers",
          items: {
            type: "integer",
          },
        },
        score: {
          type: "integer",
          format: "int32",
          description: "积分",
          default: 0,
          "x-fieldName": "score",
          "x-message": "请输入",
          "x-showTable": true,
          "x-showSorter": true,
        },
        userNo: {
          type: "integer",
          format: "int32",
          description: "编号",
          "x-fieldName": "user_no",
          "x-message": "请输入",
          "x-increment": true,
        },
      },
      example: {
        id: "fc3c286e-78b3-490b-be6a-79a6069fd68e",
        name: "gabe",
        nickname: "gabe",
        gender: 1,
        avatar: "/images/avatar.jpg",
        mobile: "13888888888",
        email: "email@email.com",
        homepage: "https://homepage.com",
        birthday: "2000-12-12",
        height: 180,
        bloodType: "A",
        notice: "test notice",
        address: {
          province: "guangdong",
          city: "guangzhou",
        },
        lives: [
          {
            x: 100,
            y: 200,
          },
          {
            x: 300,
            y: 400,
          },
        ],
        labels: ["斜杆", "青年"],
        luckyNumbers: [9, 5, 2, 7],
        score: 8848,
      },
    },
    Auth: {
      type: "object",
      description: "鉴权模型",
      "x-isModel": true,
      "x-plural": "Auths",
      "x-tableName": "auth",
      "x-underscored": true,
      "x-paranoid": true,
      "x-tags": ["auth"],
      "x-apis": [
        "findAndCountAll",
        "findByPk",
        "singleCreate",
        "bulkCreate",
        "bulkUpdate",
        "updateByPk",
        "bulkDestroy",
        "destroyByPk",
        "findOne",
        "findOrCreate",
      ],
      required: ["id", "userId", "authType", "authName"],
      properties: {
        id: {
          type: "string",
          format: "uuid",
          description: "ID",
          uniqueItems: true,
          example: "fc3c286e-78b3-490b-be6a-79a6069fd68e",
          "x-fieldName": "id",
          "x-primaryKey": true,
        },
        userId: {
          type: "string",
          format: "uuid",
          description: "用户ID",
          example: "cc1aca88-feae-4dad-b906-cad6d50e16de",
          "x-fieldName": "user_id",
          "x-foreignKey": true,
          "x-refFieldKey": "id",
          "x-ref": "#/definitions/User",
        },
        user: {
          "x-refFieldKey": "id",
          "x-description": "用户",
          $ref: "#/definitions/User",
        },
        authType: {
          type: "string",
          format: "string",
          enum: ["account", "email", "phone", "wechat", "weibo"],
          example: "account",
          "x-message": "请选择",
          "x-fieldName": "auth_type",
          "x-length": 16,
          "x-showTable": true,
          "x-enumMap": {
            account: "帐号",
            email: "邮箱",
            phone: "手机",
            wechat: "微信",
            weibo: "微博",
          },
          "x-description": "鉴权类型",
          description:
            "'鉴权类型'\n  * account - 帐号\n  * email - 邮箱\n  * phone - 手机\n  * wechat - 微信\n  * weibo - 微博\n",
        },
        authName: {
          type: "string",
          format: "string",
          description: "鉴权名称",
          example: "gabe",
          "x-fieldName": "auth_name",
          "x-message": "请输入",
          "x-showTable": true,
          "x-length": 128,
        },
        authCode: {
          type: "string",
          format: "string",
          description: "鉴权识别码",
          example: "******",
          "x-fieldName": "auth_code",
          "x-message": "请输入",
        },
        verifyTime: {
          type: "string",
          format: "date-time",
          description: "认证时间",
          "x-fieldName": "verify_time",
          "x-message": "请选择",
        },
        expireTime: {
          type: "string",
          format: "date-time",
          description: "过期时间",
          "x-fieldName": "expire_time",
          "x-message": "请选择",
        },
        isEnabled: {
          type: "boolean",
          format: "boolean",
          description: "是否启用",
          default: true,
          "x-fieldName": "is_enabled",
          "x-message": "请选择",
          "x-showTable": true,
          "x-showFilter": true,
        },
      },
      example: {
        id: "fc3c286e-78b3-490b-be6a-79a6069fd68e",
        userId: "cc1aca88-feae-4dad-b906-cad6d50e16de",
        authType: "account",
        authName: "gabe",
        authCode: "******",
        verifyTime: "2012-12-12 12:12:12",
        expireTime: "2013-12-12 12:12:12",
        isEnabled: true,
      },
    },
    Role: {
      type: "object",
      description: "角色模型",
      "x-isModel": true,
      "x-plural": "Roles",
      "x-tableName": "role",
      "x-underscored": true,
      "x-paranoid": true,
      "x-tags": ["role"],
      "x-apis": [
        "findAndCountAll",
        "findByPk",
        "singleCreate",
        "bulkCreate",
        "bulkUpdate",
        "updateByPk",
        "bulkDestroy",
        "destroyByPk",
        "findOne",
        "findOrCreate",
      ],
      required: ["id", "name"],
      properties: {
        id: {
          type: "string",
          format: "uuid",
          description: "ID",
          uniqueItems: true,
          example: "fc3c286e-78b3-490b-be6a-79a6069fd68e",
          "x-fieldName": "id",
          "x-primaryKey": true,
        },
        name: {
          type: "string",
          format: "string",
          description: "角色名",
          uniqueItems: true,
          example: "admin",
          minLength: 3,
          maxLength: 20,
          "x-fieldName": "name",
          "x-message": "请输入",
          "x-showTable": true,
          "x-length": 32,
        },
        menus: {
          type: "array",
          format: "array",
          description: "菜单",
          "x-fieldName": "menus",
          items: {
            $ref: "#/definitions/Menu",
          },
        },
      },
      example: {
        id: "fc3c286e-78b3-490b-be6a-79a6069fd68e",
        name: "admin",
      },
    },
    Menu: {
      type: "object",
      description: "菜单模型",
      "x-isModel": true,
      "x-plural": "Menus",
      "x-tableName": "menu",
      "x-underscored": true,
      "x-paranoid": true,
      "x-tags": ["menu"],
      "x-apis": [
        "findAndCountAll",
        "findByPk",
        "singleCreate",
        "bulkCreate",
        "bulkUpdate",
        "updateByPk",
        "bulkDestroy",
        "destroyByPk",
        "findOne",
        "findOrCreate",
      ],
      required: ["id", "name", "path", "sort"],
      properties: {
        id: {
          type: "string",
          format: "uuid",
          description: "ID",
          uniqueItems: true,
          example: "fc3c286e-78b3-490b-be6a-79a6069fd68e",
          "x-fieldName": "id",
          "x-primaryKey": true,
        },
        parentId: {
          type: "string",
          format: "uuid",
          description: "父ID",
          example: "cc1aca88-feae-4dad-b906-cad6d50e16de",
          "x-fieldName": "parent_id",
        },
        name: {
          type: "string",
          format: "string",
          description: "菜单名",
          example: "dashboard",
          "x-fieldName": "name",
          "x-message": "请输入",
          "x-showTable": true,
          "x-length": 64,
        },
        path: {
          type: "string",
          format: "string",
          description: "菜单路径",
          example: "/dashboard",
          "x-fieldName": "path",
          "x-message": "请输入",
          "x-showTable": true,
        },
        icon: {
          type: "string",
          format: "string",
          description: "菜单图标",
          example: "dashboard",
          "x-fieldName": "icon",
          "x-message": "请输入",
          "x-showTable": true,
          "x-length": 64,
        },
        sort: {
          type: "integer",
          format: "int32",
          description: "菜单排序",
          default: 0,
          "x-fieldName": "sort",
          "x-message": "请输入",
          "x-showTable": true,
          "x-showSorter": true,
        },
      },
      example: {
        id: "fc3c286e-78b3-490b-be6a-79a6069fd68e",
        parentId: null,
        name: "dashboard",
        path: "/dashboard",
        icon: "dashboard",
        sort: 0,
      },
    },
    Group: {
      type: "object",
      description: "组模型",
      "x-isModel": true,
      "x-plural": "Groups",
      "x-tableName": "group",
      "x-underscored": true,
      "x-paranoid": true,
      "x-tags": ["group"],
      "x-apis": [
        "findAndCountAll",
        "findByPk",
        "singleCreate",
        "bulkCreate",
        "bulkUpdate",
        "updateByPk",
        "bulkDestroy",
        "destroyByPk",
        "findOne",
        "findOrCreate",
      ],
      required: ["id", "name", "leaderId"],
      properties: {
        id: {
          type: "string",
          format: "uuid",
          description: "ID",
          uniqueItems: true,
          example: "fc3c286e-78b3-490b-be6a-79a6069fd68e",
          "x-fieldName": "id",
          "x-primaryKey": true,
        },
        name: {
          type: "string",
          format: "string",
          description: "组名",
          uniqueItems: true,
          example: "admin",
          minLength: 3,
          maxLength: 20,
          "x-fieldName": "name",
          "x-message": "请输入",
          "x-showTable": true,
          "x-length": 32,
        },
        leaderId: {
          type: "string",
          format: "uuid",
          description: "队长ID",
          example: "cc1aca88-feae-4dad-b906-cad6d50e16de",
          "x-fieldName": "leader_id",
          "x-foreignKey": true,
          "x-refFieldKey": "id",
          "x-ref": "#/definitions/User",
        },
        leader: {
          "x-fieldName": "leader",
          "x-refFieldKey": "id",
          "x-description": "队长",
          $ref: "#/definitions/User",
        },
        menbers: {
          type: "array",
          format: "array",
          description: "队员",
          "x-fieldName": "menbers",
          items: {
            $ref: "#/definitions/User",
          },
        },
      },
      example: {
        id: "fc3c286e-78b3-490b-be6a-79a6069fd68e",
        name: "titanic",
        leaderId: "cc1aca88-feae-4dad-b906-cad6d50e16de",
      },
    },
    UserGroup: {
      type: "object",
      description: "用户-组模型",
      "x-isModel": true,
      "x-plural": "UserGroups",
      "x-tableName": "usergroup",
      "x-underscored": true,
      "x-paranoid": false,
      "x-tags": ["user", "group"],
      "x-apis": [
        "findAndCountAll",
        "findByPk",
        "singleCreate",
        "bulkCreate",
        "bulkUpdate",
        "updateByPk",
        "bulkDestroy",
        "destroyByPk",
      ],
      required: ["id", "userId", "groupId"],
      properties: {
        id: {
          type: "string",
          format: "uuid",
          description: "ID",
          uniqueItems: true,
          example: "fc3c286e-78b3-490b-be6a-79a6069fd68e",
          "x-fieldName": "id",
          "x-primaryKey": true,
        },
        userId: {
          type: "string",
          format: "uuid",
          description: "用户ID",
          example: "cc1aca88-feae-4dad-b906-cad6d50e16de",
          "x-fieldName": "user_id",
          "x-showTable": true,
        },
        groupId: {
          type: "string",
          format: "uuid",
          description: "组ID",
          example: "cc1aca88-feae-4dad-b906-cad6d50e16de",
          "x-fieldName": "group_id",
          "x-showTable": true,
        },
        level: {
          type: "integer",
          format: "int4",
          description: "级别",
          default: 0,
          "x-fieldName": "level",
          "x-message": "请输入",
          "x-showTable": true,
          "x-showSorter": true,
        },
        joinTime: {
          type: "string",
          format: "date-time",
          description: "加入时间",
          "x-fieldName": "join_time",
          "x-message": "请选择",
        },
      },
      example: {
        id: "fc3c286e-78b3-490b-be6a-79a6069fd68e",
        userId: "6b0fba36-764e-43a6-a7f1-767e62ccb47b",
        groupId: "a91fb15b-2419-4e7d-ab0a-910fc338cd61",
        level: 0,
        joinTime: "2012-12-12 12:12:12",
      },
    },
    LoginBody: {
      type: "object",
      description: "登录参数模型",
      required: ["userName", "password"],
      properties: {
        userName: {
          type: "string",
          description: "用户名",
        },
        password: {
          type: "string",
          description: "密码",
        },
      },
      example: {
        userName: "gabe",
        password: "123456",
      },
    },
    LoginResponse: {
      type: "object",
      description: "登录返回数据模型",
      required: ["status", "type", "message", "authtoken", "currentAuthority"],
      properties: {
        status: {
          type: "string",
          description: "状态",
        },
        type: {
          type: "string",
          description: "登录类型",
        },
        message: {
          type: "string",
          description: "描述",
        },
        authToken: {
          type: "string",
          description: "token",
        },
        currentAuthority: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
      example: {
        status: "ok",
        type: "account",
        message: "登录成功",
        authToken: "abc...",
        currentAuthority: ["admin", "user", "guest"],
      },
    },
    Error: {
      type: "object",
      description: "错误模型",
      required: ["message"],
      properties: {
        message: {
          type: "string",
          description: "提示信息",
        },
        errors: {
          type: "array",
          description: "错误信息",
          items: {
            $ref: "#/definitions/ErrorItem",
          },
        },
      },
    },
    ErrorItem: {
      type: "object",
      description: "错误项",
      properties: {
        errcode: {
          type: "integer",
          description: "错误代码",
        },
        errmsg: {
          type: "string",
          description: "错误信息",
        },
      },
    },
  },
  "x-associations": [
    {
      source: "User",
      target: "Auth",
      type: "hasMany",
      as: "auths",
      foreignKey: "userId",
      sourceKey: "id",
    },
    {
      source: "Auth",
      target: "User",
      type: "belongsTo",
      as: "user",
      foreignKey: "userId",
      targetKey: "id",
    },
    {
      source: "Menu",
      target: "Menu",
      type: "hasMany",
      as: "children",
      foreignKey: "parentId",
      sourceKey: "id",
    },
    {
      source: "Menu",
      target: "Menu",
      type: "belongsTo",
      as: "parent",
      foreignKey: "parentId",
      targetKey: "id",
    },
    {
      source: "User",
      target: "Role",
      type: "belongsToMany",
      as: "roles",
      throughModel: false,
      through: "userrole",
      foreignKey: "userId",
      otherKey: "roleId",
    },
    {
      source: "Role",
      target: "User",
      type: "belongsToMany",
      as: "users",
      throughModel: false,
      through: "userrole",
      foreignKey: "roleId",
      otherKey: "userId",
    },
    {
      source: "Menu",
      target: "Role",
      type: "belongsToMany",
      as: "roles",
      throughModel: false,
      through: "rolemenu",
      foreignKey: "menuId",
      otherKey: "roleId",
    },
    {
      source: "Role",
      target: "Menu",
      type: "belongsToMany",
      as: "menus",
      throughModel: false,
      through: "rolemenu",
      foreignKey: "roleId",
      otherKey: "menuId",
    },
    {
      source: "Group",
      target: "User",
      type: "belongsTo",
      as: "leader",
      foreignKey: "leaderId",
      targetKey: "id",
    },
    {
      source: "User",
      target: "Group",
      type: "belongsToMany",
      as: "groups",
      throughModel: true,
      through: "UserGroup",
      foreignKey: "userId",
      otherKey: "groupId",
    },
    {
      source: "Group",
      target: "User",
      type: "belongsToMany",
      as: "menbers",
      throughModel: true,
      through: "UserGroup",
      foreignKey: "groupId",
      otherKey: "userId",
    },
    {
      source: "User",
      target: "User",
      type: "belongsToMany",
      as: "friends",
      throughModel: false,
      through: "userfriend",
      foreignKey: "userId",
      otherKey: "friendId",
    },
  ],
};

const definitions = {
  User: {
    type: "object",
    description: "用户模型",
    "x-isModel": true,
    "x-plural": "Users",
    "x-tableName": "user",
    "x-underscored": true,
    "x-paranoid": true,
    "x-tags": ["user"],
    "x-apis": [
      "findAndCountAll",
      "findByPk",
      "singleCreate",
      "bulkCreate",
      "bulkUpdate",
      "updateByPk",
      "bulkDestroy",
      "destroyByPk",
      "findOne",
      "findOrCreate",
    ],
    required: ["id", "name"],
    properties: {
      id: {
        type: "string",
        format: "uuid",
        description: "ID",
        uniqueItems: true,
        example: "fc3c286e-78b3-490b-be6a-79a6069fd68e",
        "x-fieldName": "id",
        "x-primaryKey": true,
      },
      name: {
        type: "string",
        format: "string",
        description: "名称",
        example: "gabe",
        minLength: 3,
        maxLength: 20,
        "x-fieldName": "name",
        "x-message": "请输入",
        "x-showTable": true,
        "x-showFilter": true,
        "x-length": 32,
      },
      nickname: {
        type: "string",
        format: "string",
        description: "昵称",
        "x-fieldName": "nickname",
        "x-message": "请输入",
        "x-length": 64,
      },
      gender: {
        type: "integer",
        format: "int4",
        enum: [0, 1, 2],
        "x-message": "请选择",
        "x-showTable": true,
        "x-showFilter": true,
        "x-fieldName": "gender",
        "x-enumMap": {
          "0": "保密",
          "1": "男",
          "2": "女",
        },
        "x-description": "性别",
        description: "'性别'\n  * 0 - 保密\n  * 1 - 男\n  * 2 - 女\n",
      },
      avatar: {
        type: "string",
        format: "string",
        description: "头像",
        "x-fieldName": "avatar",
        "x-message": "请输入",
      },
      mobile: {
        type: "string",
        format: "string",
        description: "手机",
        "x-fieldName": "mobile",
        "x-message": "请输入",
        "x-length": 16,
      },
      email: {
        type: "string",
        format: "email",
        description: "邮箱",
        "x-fieldName": "email",
        "x-message": "请输入",
      },
      homepage: {
        type: "string",
        format: "uri",
        description: "主页",
        "x-fieldName": "homepage",
        "x-message": "请输入",
      },
      birthday: {
        type: "string",
        format: "date",
        description: "生日",
        "x-fieldName": "birthday",
        "x-message": "请选择",
        "x-showTable": true,
        "x-showSorter": true,
      },
      height: {
        type: "number",
        format: "float",
        description: "身高(cm)",
        minimum: 0.01,
        maximum: 250,
        "x-fieldName": "height",
        "x-message": "请输入",
        "x-showTable": true,
        "x-showSorter": true,
      },
      bloodType: {
        type: "string",
        format: "string",
        enum: ["A", "B", "AB", "O", "NULL"],
        "x-message": "请选择",
        "x-fieldName": "blood_type",
        "x-enumMap": {
          A: "A",
          B: "B",
          AB: "AB",
          O: "O",
          NULL: "保密",
        },
        "x-description": "血型(ABO)",
        description:
          "'血型(ABO)'\n  * A - A型\n  * B - B型\n  * AB - AB型\n  * O - O型\n  * NULL - 保密\n",
      },
      notice: {
        type: "string",
        format: "text",
        description: "备注",
        "x-fieldName": "notice",
        "x-message": "请输入",
      },
      intro: {
        type: "string",
        format: "text",
        description: "介绍",
        "x-fieldName": "intro",
        "x-message": "请输入",
        "x-isRichText": true,
      },
      address: {
        type: "object",
        format: "object",
        description: "地址",
        "x-fieldName": "address",
        "x-message": "请输入",
        properties: {
          province: {
            type: "string",
            description: "省",
          },
          city: {
            type: "string",
            description: "市",
          },
        },
      },
      lives: {
        type: "array",
        format: "array",
        description: "生活轨迹",
        "x-fieldName": "lives",
        items: {
          type: "object",
          properties: {
            x: {
              type: "string",
              description: "x坐标",
            },
            y: {
              type: "string",
              description: "y坐标",
            },
          },
        },
      },
      roles: {
        type: "array",
        format: "array",
        description: "角色",
        "x-fieldName": "roles",
        items: {
          $ref: "#/definitions/Role",
        },
      },
      groups: {
        type: "array",
        format: "array",
        description: "组",
        "x-fieldName": "groups",
        items: {
          $ref: "#/definitions/Group",
        },
      },
      friends: {
        type: "array",
        format: "array",
        description: "朋友",
        "x-fieldName": "friends",
        items: {
          $ref: "#/definitions/User",
        },
      },
      tags: {
        type: "array",
        format: "array",
        description: "标签",
        "x-fieldName": "tags",
        items: {
          type: "string",
        },
      },
      luckyNumbers: {
        type: "array",
        format: "array",
        description: "幸运数字",
        "x-fieldName": "lucky_numbers",
        items: {
          type: "integer",
        },
      },
      score: {
        type: "integer",
        format: "int32",
        description: "积分",
        default: 0,
        "x-fieldName": "score",
        "x-message": "请输入",
        "x-showTable": true,
        "x-showSorter": true,
      },
      userNo: {
        type: "integer",
        format: "int32",
        description: "编号",
        "x-fieldName": "user_no",
        "x-message": "请输入",
        "x-increment": true,
      },
    },
    example: {
      id: "fc3c286e-78b3-490b-be6a-79a6069fd68e",
      name: "gabe",
      nickname: "gabe",
      gender: 1,
      avatar: "/images/avatar.jpg",
      mobile: "13888888888",
      email: "email@email.com",
      homepage: "https://homepage.com",
      birthday: "2000-12-12",
      height: 180,
      bloodType: "A",
      notice: "test notice",
      address: {
        province: "guangdong",
        city: "guangzhou",
      },
      lives: [
        {
          x: 100,
          y: 200,
        },
        {
          x: 300,
          y: 400,
        },
      ],
      labels: ["斜杆", "青年"],
      luckyNumbers: [9, 5, 2, 7],
      score: 8848,
    },
  },
  Auth: {
    type: "object",
    description: "鉴权模型",
    "x-isModel": true,
    "x-plural": "Auths",
    "x-tableName": "auth",
    "x-underscored": true,
    "x-paranoid": true,
    "x-tags": ["auth"],
    "x-apis": [
      "findAndCountAll",
      "findByPk",
      "singleCreate",
      "bulkCreate",
      "bulkUpdate",
      "updateByPk",
      "bulkDestroy",
      "destroyByPk",
      "findOne",
      "findOrCreate",
    ],
    required: ["id", "userId", "authType", "authName"],
    properties: {
      id: {
        type: "string",
        format: "uuid",
        description: "ID",
        uniqueItems: true,
        example: "fc3c286e-78b3-490b-be6a-79a6069fd68e",
        "x-fieldName": "id",
        "x-primaryKey": true,
      },
      userId: {
        type: "string",
        format: "uuid",
        description: "用户ID",
        example: "cc1aca88-feae-4dad-b906-cad6d50e16de",
        "x-fieldName": "user_id",
        "x-foreignKey": true,
        "x-refFieldKey": "id",
        "x-ref": "#/definitions/User",
      },
      user: {
        "x-refFieldKey": "id",
        "x-description": "用户",
        $ref: "#/definitions/User",
      },
      authType: {
        type: "string",
        format: "string",
        enum: ["account", "email", "phone", "wechat", "weibo"],
        example: "account",
        "x-message": "请选择",
        "x-fieldName": "auth_type",
        "x-length": 16,
        "x-showTable": true,
        "x-enumMap": {
          account: "帐号",
          email: "邮箱",
          phone: "手机",
          wechat: "微信",
          weibo: "微博",
        },
        "x-description": "鉴权类型",
        description:
          "'鉴权类型'\n  * account - 帐号\n  * email - 邮箱\n  * phone - 手机\n  * wechat - 微信\n  * weibo - 微博\n",
      },
      authName: {
        type: "string",
        format: "string",
        description: "鉴权名称",
        example: "gabe",
        "x-fieldName": "auth_name",
        "x-message": "请输入",
        "x-showTable": true,
        "x-length": 128,
      },
      authCode: {
        type: "string",
        format: "string",
        description: "鉴权识别码",
        example: "******",
        "x-fieldName": "auth_code",
        "x-message": "请输入",
      },
      verifyTime: {
        type: "string",
        format: "date-time",
        description: "认证时间",
        "x-fieldName": "verify_time",
        "x-message": "请选择",
      },
      expireTime: {
        type: "string",
        format: "date-time",
        description: "过期时间",
        "x-fieldName": "expire_time",
        "x-message": "请选择",
      },
      isEnabled: {
        type: "boolean",
        format: "boolean",
        description: "是否启用",
        default: true,
        "x-fieldName": "is_enabled",
        "x-message": "请选择",
        "x-showTable": true,
        "x-showFilter": true,
      },
    },
    example: {
      id: "fc3c286e-78b3-490b-be6a-79a6069fd68e",
      userId: "cc1aca88-feae-4dad-b906-cad6d50e16de",
      authType: "account",
      authName: "gabe",
      authCode: "******",
      verifyTime: "2012-12-12 12:12:12",
      expireTime: "2013-12-12 12:12:12",
      isEnabled: true,
    },
  },
  Role: {
    type: "object",
    description: "角色模型",
    "x-isModel": true,
    "x-plural": "Roles",
    "x-tableName": "role",
    "x-underscored": true,
    "x-paranoid": true,
    "x-tags": ["role"],
    "x-apis": [
      "findAndCountAll",
      "findByPk",
      "singleCreate",
      "bulkCreate",
      "bulkUpdate",
      "updateByPk",
      "bulkDestroy",
      "destroyByPk",
      "findOne",
      "findOrCreate",
    ],
    required: ["id", "name"],
    properties: {
      id: {
        type: "string",
        format: "uuid",
        description: "ID",
        uniqueItems: true,
        example: "fc3c286e-78b3-490b-be6a-79a6069fd68e",
        "x-fieldName": "id",
        "x-primaryKey": true,
      },
      name: {
        type: "string",
        format: "string",
        description: "角色名",
        uniqueItems: true,
        example: "admin",
        minLength: 3,
        maxLength: 20,
        "x-fieldName": "name",
        "x-message": "请输入",
        "x-showTable": true,
        "x-length": 32,
      },
      menus: {
        type: "array",
        format: "array",
        description: "菜单",
        "x-fieldName": "menus",
        items: {
          $ref: "#/definitions/Menu",
        },
      },
    },
    example: {
      id: "fc3c286e-78b3-490b-be6a-79a6069fd68e",
      name: "admin",
    },
  },
  Menu: {
    type: "object",
    description: "菜单模型",
    "x-isModel": true,
    "x-plural": "Menus",
    "x-tableName": "menu",
    "x-underscored": true,
    "x-paranoid": true,
    "x-tags": ["menu"],
    "x-apis": [
      "findAndCountAll",
      "findByPk",
      "singleCreate",
      "bulkCreate",
      "bulkUpdate",
      "updateByPk",
      "bulkDestroy",
      "destroyByPk",
      "findOne",
      "findOrCreate",
    ],
    required: ["id", "name", "path", "sort"],
    properties: {
      id: {
        type: "string",
        format: "uuid",
        description: "ID",
        uniqueItems: true,
        example: "fc3c286e-78b3-490b-be6a-79a6069fd68e",
        "x-fieldName": "id",
        "x-primaryKey": true,
      },
      parentId: {
        type: "string",
        format: "uuid",
        description: "父ID",
        example: "cc1aca88-feae-4dad-b906-cad6d50e16de",
        "x-fieldName": "parent_id",
      },
      name: {
        type: "string",
        format: "string",
        description: "菜单名",
        example: "dashboard",
        "x-fieldName": "name",
        "x-message": "请输入",
        "x-showTable": true,
        "x-length": 64,
      },
      path: {
        type: "string",
        format: "string",
        description: "菜单路径",
        example: "/dashboard",
        "x-fieldName": "path",
        "x-message": "请输入",
        "x-showTable": true,
      },
      icon: {
        type: "string",
        format: "string",
        description: "菜单图标",
        example: "dashboard",
        "x-fieldName": "icon",
        "x-message": "请输入",
        "x-showTable": true,
        "x-length": 64,
      },
      sort: {
        type: "integer",
        format: "int32",
        description: "菜单排序",
        default: 0,
        "x-fieldName": "sort",
        "x-message": "请输入",
        "x-showTable": true,
        "x-showSorter": true,
      },
    },
    example: {
      id: "fc3c286e-78b3-490b-be6a-79a6069fd68e",
      parentId: null,
      name: "dashboard",
      path: "/dashboard",
      icon: "dashboard",
      sort: 0,
    },
  },
  Group: {
    type: "object",
    description: "组模型",
    "x-isModel": true,
    "x-plural": "Groups",
    "x-tableName": "group",
    "x-underscored": true,
    "x-paranoid": true,
    "x-tags": ["group"],
    "x-apis": [
      "findAndCountAll",
      "findByPk",
      "singleCreate",
      "bulkCreate",
      "bulkUpdate",
      "updateByPk",
      "bulkDestroy",
      "destroyByPk",
      "findOne",
      "findOrCreate",
    ],
    required: ["id", "name", "leaderId"],
    properties: {
      id: {
        type: "string",
        format: "uuid",
        description: "ID",
        uniqueItems: true,
        example: "fc3c286e-78b3-490b-be6a-79a6069fd68e",
        "x-fieldName": "id",
        "x-primaryKey": true,
      },
      name: {
        type: "string",
        format: "string",
        description: "组名",
        uniqueItems: true,
        example: "admin",
        minLength: 3,
        maxLength: 20,
        "x-fieldName": "name",
        "x-message": "请输入",
        "x-showTable": true,
        "x-length": 32,
      },
      leaderId: {
        type: "string",
        format: "uuid",
        description: "队长ID",
        example: "cc1aca88-feae-4dad-b906-cad6d50e16de",
        "x-fieldName": "leader_id",
        "x-foreignKey": true,
        "x-refFieldKey": "id",
        "x-ref": "#/definitions/User",
      },
      leader: {
        "x-fieldName": "leader",
        "x-refFieldKey": "id",
        "x-description": "队长",
        $ref: "#/definitions/User",
      },
      menbers: {
        type: "array",
        format: "array",
        description: "队员",
        "x-fieldName": "menbers",
        items: {
          $ref: "#/definitions/User",
        },
      },
    },
    example: {
      id: "fc3c286e-78b3-490b-be6a-79a6069fd68e",
      name: "titanic",
      leaderId: "cc1aca88-feae-4dad-b906-cad6d50e16de",
    },
  },
  UserGroup: {
    type: "object",
    description: "用户-组模型",
    "x-isModel": true,
    "x-plural": "UserGroups",
    "x-tableName": "usergroup",
    "x-underscored": true,
    "x-paranoid": false,
    "x-tags": ["user", "group"],
    "x-apis": [
      "findAndCountAll",
      "findByPk",
      "singleCreate",
      "bulkCreate",
      "bulkUpdate",
      "updateByPk",
      "bulkDestroy",
      "destroyByPk",
    ],
    required: ["id", "userId", "groupId"],
    properties: {
      id: {
        type: "string",
        format: "uuid",
        description: "ID",
        uniqueItems: true,
        example: "fc3c286e-78b3-490b-be6a-79a6069fd68e",
        "x-fieldName": "id",
        "x-primaryKey": true,
      },
      userId: {
        type: "string",
        format: "uuid",
        description: "用户ID",
        example: "cc1aca88-feae-4dad-b906-cad6d50e16de",
        "x-fieldName": "user_id",
        "x-showTable": true,
      },
      groupId: {
        type: "string",
        format: "uuid",
        description: "组ID",
        example: "cc1aca88-feae-4dad-b906-cad6d50e16de",
        "x-fieldName": "group_id",
        "x-showTable": true,
      },
      level: {
        type: "integer",
        format: "int4",
        description: "级别",
        default: 0,
        "x-fieldName": "level",
        "x-message": "请输入",
        "x-showTable": true,
        "x-showSorter": true,
      },
      joinTime: {
        type: "string",
        format: "date-time",
        description: "加入时间",
        "x-fieldName": "join_time",
        "x-message": "请选择",
      },
    },
    example: {
      id: "fc3c286e-78b3-490b-be6a-79a6069fd68e",
      userId: "6b0fba36-764e-43a6-a7f1-767e62ccb47b",
      groupId: "a91fb15b-2419-4e7d-ab0a-910fc338cd61",
      level: 0,
      joinTime: "2012-12-12 12:12:12",
    },
  },
  LoginBody: {
    type: "object",
    description: "登录参数模型",
    required: ["userName", "password"],
    properties: {
      userName: {
        type: "string",
        description: "用户名",
      },
      password: {
        type: "string",
        description: "密码",
      },
    },
    example: {
      userName: "gabe",
      password: "123456",
    },
  },
  LoginResponse: {
    type: "object",
    description: "登录返回数据模型",
    required: ["status", "type", "message", "authtoken", "currentAuthority"],
    properties: {
      status: {
        type: "string",
        description: "状态",
      },
      type: {
        type: "string",
        description: "登录类型",
      },
      message: {
        type: "string",
        description: "描述",
      },
      authToken: {
        type: "string",
        description: "token",
      },
      currentAuthority: {
        type: "array",
        items: {
          type: "string",
        },
      },
    },
    example: {
      status: "ok",
      type: "account",
      message: "登录成功",
      authToken: "abc...",
      currentAuthority: ["admin", "user", "guest"],
    },
  },
  Error: {
    type: "object",
    description: "错误模型",
    required: ["message"],
    properties: {
      message: {
        type: "string",
        description: "提示信息",
      },
      errors: {
        type: "array",
        description: "错误信息",
        items: {
          $ref: "#/definitions/ErrorItem",
        },
      },
    },
  },
  ErrorItem: {
    type: "object",
    description: "错误项",
    properties: {
      errcode: {
        type: "integer",
        description: "错误代码",
      },
      errmsg: {
        type: "string",
        description: "错误信息",
      },
    },
  },
};

const dataTypes = {
  integer: {
    int4: ["TINYINT", "SmallInteger", "int"],
    int8: ["SMALLINT", "SmallInteger", "int"],
    int16: ["MEDIUMINT", "Integer", "int"],
    int32: ["INTEGER", "Integer", "int"],
    int64: ["BIGINT", "BigInteger", "int"],
    "time-stamp": ["INTEGER", "TIMESTAMP", "int"],
  },
  number: {
    float: ["FLOAT", "Float", "float32"],
    double: ["DOUBLE", "Float", "float32"],
    decimal: ["DECIMAL", "Numeric", "float32"],
  },
  string: {
    char: ["CHAR", "CHAR", "string"],
    string: ["STRING", "String", "string"],
    text: ["TEXT", "Text", "string"],
    date: ["DATEONLY", "Date", "time.Time"],
    "date-time": ["DATE", "DateTime", "time.Time"],
    // "date-time(6)": ["DATE", "DateTime", "time.Time"],
    email: ["STRING", "String", "string"],
    uri: ["STRING", "String", "string"],
    hostname: ["STRING", "String", "string"],
    ipv4: ["STRING", "String", "string"],
    ipv6: ["STRING", "String", "string"],
    byte: ["STRING", "String", "string"],
    binary: ["STRING.BINARY", "LargeBinary", "string"],
    password: ["STRING", "String", "string"],
    uuid: ["UUID", "String", "string"],
    // json: ["JSON", "JSON", "string"],
  },
  object: {
    object: ["JSON", "JSON", "string"],
  },
  array: {
    array: ["JSON", "ARRAY", "string"],
  },
  boolean: {
    boolean: ["BOOLEAN", "Boolean", "bool"],
  },
};

const dataFormats = Object.assign(
  ...Object.entries(dataTypes).map(([_, item]) => item)
);

const associations = [
  {
    source: "User",
    target: "Auth",
    type: "hasMany",
    as: "auths",
    foreignKey: "userId",
    sourceKey: "id",
  },
  {
    source: "Auth",
    target: "User",
    type: "belongsTo",
    as: "user",
    foreignKey: "userId",
    targetKey: "id",
  },
  {
    source: "Menu",
    target: "Menu",
    type: "hasMany",
    as: "children",
    foreignKey: "parentId",
    sourceKey: "id",
  },
  {
    source: "Menu",
    target: "Menu",
    type: "belongsTo",
    as: "parent",
    foreignKey: "parentId",
    targetKey: "id",
  },
  {
    source: "User",
    target: "Role",
    type: "belongsToMany",
    as: "roles",
    throughModel: false,
    through: "userrole",
    foreignKey: "userId",
    otherKey: "roleId",
  },
  {
    source: "Role",
    target: "User",
    type: "belongsToMany",
    as: "users",
    throughModel: false,
    through: "userrole",
    foreignKey: "roleId",
    otherKey: "userId",
  },
  {
    source: "Menu",
    target: "Role",
    type: "belongsToMany",
    as: "roles",
    throughModel: false,
    through: "rolemenu",
    foreignKey: "menuId",
    otherKey: "roleId",
  },
  {
    source: "Role",
    target: "Menu",
    type: "belongsToMany",
    as: "menus",
    throughModel: false,
    through: "rolemenu",
    foreignKey: "roleId",
    otherKey: "menuId",
  },
  {
    source: "Group",
    target: "User",
    type: "belongsTo",
    as: "leader",
    foreignKey: "leaderId",
    targetKey: "id",
  },
  {
    source: "User",
    target: "Group",
    type: "belongsToMany",
    as: "groups",
    throughModel: true,
    through: "UserGroup",
    foreignKey: "userId",
    otherKey: "groupId",
  },
  {
    source: "Group",
    target: "User",
    type: "belongsToMany",
    as: "menbers",
    throughModel: true,
    through: "UserGroup",
    foreignKey: "groupId",
    otherKey: "userId",
  },
  {
    source: "User",
    target: "User",
    type: "belongsToMany",
    as: "friends",
    throughModel: false,
    through: "userfriend",
    foreignKey: "userId",
    otherKey: "friendId",
  },
];

const modelKey = "User";

const model = {
  type: "object",
  description: "用户模型",
  "x-isModel": true,
  "x-plural": "Users",
  "x-tableName": "user",
  "x-underscored": true,
  "x-paranoid": true,
  "x-tags": ["user"],
  "x-apis": [
    "findAndCountAll",
    "findByPk",
    "singleCreate",
    "bulkCreate",
    "bulkUpdate",
    "updateByPk",
    "bulkDestroy",
    "destroyByPk",
    "findOne",
    "findOrCreate",
  ],
  required: ["id", "name"],
  properties: {
    id: {
      type: "string",
      format: "uuid",
      description: "ID",
      uniqueItems: true,
      example: "fc3c286e-78b3-490b-be6a-79a6069fd68e",
      "x-fieldName": "id",
      "x-primaryKey": true,
    },
    name: {
      type: "string",
      format: "string",
      description: "名称",
      example: "gabe",
      minLength: 3,
      maxLength: 20,
      "x-fieldName": "name",
      "x-message": "请输入",
      "x-showTable": true,
      "x-showFilter": true,
      "x-length": 32,
    },
    nickname: {
      type: "string",
      format: "string",
      description: "昵称",
      "x-fieldName": "nickname",
      "x-message": "请输入",
      "x-length": 64,
    },
    gender: {
      type: "integer",
      format: "int4",
      enum: [0, 1, 2],
      "x-message": "请选择",
      "x-showTable": true,
      "x-showFilter": true,
      "x-fieldName": "gender",
      "x-enumMap": {
        "0": "保密",
        "1": "男",
        "2": "女",
      },
      "x-description": "性别",
      description: "'性别'\n  * 0 - 保密\n  * 1 - 男\n  * 2 - 女\n",
    },
    avatar: {
      type: "string",
      format: "string",
      description: "头像",
      "x-fieldName": "avatar",
      "x-message": "请输入",
    },
    mobile: {
      type: "string",
      format: "string",
      description: "手机",
      "x-fieldName": "mobile",
      "x-message": "请输入",
      "x-length": 16,
    },
    email: {
      type: "string",
      format: "email",
      description: "邮箱",
      "x-fieldName": "email",
      "x-message": "请输入",
    },
    homepage: {
      type: "string",
      format: "uri",
      description: "主页",
      "x-fieldName": "homepage",
      "x-message": "请输入",
    },
    birthday: {
      type: "string",
      format: "date",
      description: "生日",
      "x-fieldName": "birthday",
      "x-message": "请选择",
      "x-showTable": true,
      "x-showSorter": true,
    },
    height: {
      type: "number",
      format: "float",
      description: "身高(cm)",
      minimum: 0.01,
      maximum: 250,
      "x-fieldName": "height",
      "x-message": "请输入",
      "x-showTable": true,
      "x-showSorter": true,
    },
    bloodType: {
      type: "string",
      format: "string",
      enum: ["A", "B", "AB", "O", "NULL"],
      "x-message": "请选择",
      "x-fieldName": "blood_type",
      "x-enumMap": {
        A: "A",
        B: "B",
        AB: "AB",
        O: "O",
        NULL: "保密",
      },
      "x-description": "血型(ABO)",
      description:
        "'血型(ABO)'\n  * A - A型\n  * B - B型\n  * AB - AB型\n  * O - O型\n  * NULL - 保密\n",
    },
    notice: {
      type: "string",
      format: "text",
      description: "备注",
      "x-fieldName": "notice",
      "x-message": "请输入",
    },
    intro: {
      type: "string",
      format: "text",
      description: "介绍",
      "x-fieldName": "intro",
      "x-message": "请输入",
      "x-isRichText": true,
    },
    address: {
      type: "object",
      format: "object",
      description: "地址",
      "x-fieldName": "address",
      "x-message": "请输入",
      properties: {
        province: {
          type: "string",
          description: "省",
        },
        city: {
          type: "string",
          description: "市",
        },
      },
    },
    lives: {
      type: "array",
      format: "array",
      description: "生活轨迹",
      "x-fieldName": "lives",
      items: {
        type: "object",
        properties: {
          x: {
            type: "string",
            description: "x坐标",
          },
          y: {
            type: "string",
            description: "y坐标",
          },
        },
      },
    },
    roles: {
      type: "array",
      format: "array",
      description: "角色",
      "x-fieldName": "roles",
      items: {
        $ref: "#/definitions/Role",
      },
    },
    groups: {
      type: "array",
      format: "array",
      description: "组",
      "x-fieldName": "groups",
      items: {
        $ref: "#/definitions/Group",
      },
    },
    friends: {
      type: "array",
      format: "array",
      description: "朋友",
      "x-fieldName": "friends",
      items: {
        $ref: "#/definitions/User",
      },
    },
    tags: {
      type: "array",
      format: "array",
      description: "标签",
      "x-fieldName": "tags",
      items: {
        type: "string",
      },
    },
    luckyNumbers: {
      type: "array",
      format: "array",
      description: "幸运数字",
      "x-fieldName": "lucky_numbers",
      items: {
        type: "integer",
      },
    },
    score: {
      type: "integer",
      format: "int32",
      description: "积分",
      default: 0,
      "x-fieldName": "score",
      "x-message": "请输入",
      "x-showTable": true,
      "x-showSorter": true,
    },
    userNo: {
      type: "integer",
      format: "int32",
      description: "编号",
      "x-fieldName": "user_no",
      "x-message": "请输入",
      "x-increment": true,
    },
  },
  example: {
    id: "fc3c286e-78b3-490b-be6a-79a6069fd68e",
    name: "gabe",
    nickname: "gabe",
    gender: 1,
    avatar: "/images/avatar.jpg",
    mobile: "13888888888",
    email: "email@email.com",
    homepage: "https://homepage.com",
    birthday: "2000-12-12",
    height: 180,
    bloodType: "A",
    notice: "test notice",
    address: {
      province: "guangdong",
      city: "guangzhou",
    },
    lives: [
      {
        x: 100,
        y: 200,
      },
      {
        x: 300,
        y: 400,
      },
    ],
    labels: ["斜杆", "青年"],
    luckyNumbers: [9, 5, 2, 7],
    score: 8848,
  },
};

const pluralLower = model["x-plural"].toLowerCase();
const properties = Object.entries(model.properties).map(([key, obj]) => ({
  ...obj,
  key,
}));
const required = model.required || [];
const filters = properties.filter(item => item["x-showFilter"]);
