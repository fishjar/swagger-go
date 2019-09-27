export default function definitionsToPaths(definitions) {
  const paths = {};
  if (!definitions) {
    return paths;
  }
  Object.entries(definitions)
    .filter(([_, model]) => model["x-isModel"])
    .forEach(([modelKey, model], index) => {
      const _name = modelKey.toLowerCase();
      const _plural = (model["x-plural"] || _name + "s").toLowerCase();
      const modelName = model["description"] || _name;
      const apis = model["x-apis"] || [];

      // console.log(`模型${index + 1}: ${modelName}`);

      // 根据条件查找单条
      if (apis.includes("findOne")) {
        if (!paths[`/${_name}`]) {
          paths[`/${_name}`] = {};
        }
        paths[`/${_name}`].get = {
          tags: [_name],
          summary: `根据条件查找单个${modelName}`,
          description: `根据条件查找单个${modelName}...`,
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
                $ref: `#/definitions/${modelKey}`,
              },
            },
          },
        };
      }

      // 查找或创建单条
      if (apis.includes("findOrCreate")) {
        if (!paths[`/${_name}`]) {
          paths[`/${_name}`] = {};
        }
        paths[`/${_name}`].post = {
          tags: [_name],
          summary: `查找或创建单个${modelName}`,
          description: `查找或创建单个${modelName}...`,
          parameters: [
            {
              in: "body",
              name: "body",
              description: "模型参数",
              required: true,
              schema: {
                $ref: `#/definitions/${modelKey}`,
              },
            },
          ],
          responses: {
            "200": {
              description: "创建成功",
              schema: {
                $ref: `#/definitions/${modelKey}`,
              },
            },
          },
        };
      }

      // 获取多条
      if (apis.includes("findAndCountAll")) {
        if (!paths[`/${_plural}`]) {
          paths[`/${_plural}`] = {};
        }
        paths[`/${_plural}`].get = {
          tags: [_name],
          summary: `查询多个${modelName}`,
          description: `查询多个${modelName}...`,
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
                      $ref: `#/definitions/${modelKey}`,
                    },
                  },
                },
              },
            },
          },
        };
      }

      // 创建单条
      if (apis.includes("singleCreate")) {
        if (!paths[`/${_plural}`]) {
          paths[`/${_plural}`] = {};
        }
        paths[`/${_plural}`].post = {
          tags: [_name],
          summary: `创建单个${modelName}`,
          description: `创建单个${modelName}...`,
          parameters: [
            {
              in: "body",
              name: "body",
              description: "模型参数",
              required: true,
              schema: {
                $ref: `#/definitions/${modelKey}`,
              },
            },
          ],
          responses: {
            "200": {
              description: "创建成功",
            },
          },
        };
      }

      // 更新多条
      if (apis.includes("bulkUpdate")) {
        if (!paths[`/${_plural}`]) {
          paths[`/${_plural}`] = {};
        }
        paths[`/${_plural}`].patch = {
          tags: [_name],
          summary: `更新多个${modelName}`,
          description: `更新多个${modelName}...`,
          parameters: [
            // {
            //   in: "body",
            //   name: "body",
            //   description: "body参数",
            //   schema: {
            //     type: "array",
            //     items: {
            //       $ref: `#/definitions/${modelKey}`,
            //     },
            //   },
            // },
            {
              in: "body",
              name: "body",
              description: "模型参数",
              required: true,
              schema: {
                $ref: `#/definitions/${modelKey}`,
              },
            },
            {
              in: "query",
              name: "id",
              required: true,
              type: "array",
              description: "ID",
              items: { type: "string" },
              collectionFormat: "multi",
            },
          ],
          responses: {
            "200": {
              description: "更新成功",
            },
          },
        };
      }

      // 删除多条
      if (apis.includes("bulkDestroy")) {
        if (!paths[`/${_plural}`]) {
          paths[`/${_plural}`] = {};
        }
        paths[`/${_plural}`].delete = {
          tags: [_name],
          summary: `删除多个${modelName}`,
          description: `删除多个${modelName}...`,
          parameters: [
            // {
            //   in: "body",
            //   name: "body",
            //   description: "body参数",
            //   schema: {
            //     type: "object",
            //     example: {
            //       id: ["1", "2"],
            //     },
            //   },
            // },
            {
              in: "query",
              name: "id",
              required: true,
              type: "array",
              description: "ID",
              items: { type: "string" },
              collectionFormat: "multi",
            },
          ],
          responses: {
            "200": {
              description: "更新成功",
            },
          },
        };
      }

      // 根据ID查找单条
      if (apis.includes("findByPk")) {
        if (!paths[`/${_plural}/:id`]) {
          paths[`/${_plural}/:id`] = {};
        }
        paths[`/${_plural}/:id`].get = {
          tags: [_name],
          summary: `查询单个${modelName}`,
          description: `查询单个${modelName}..`,
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
                $ref: `#/definitions/${modelKey}`,
              },
            },
          },
        };
      }

      // 更新单条
      if (apis.includes("updateByPk")) {
        if (!paths[`/${_plural}/:id`]) {
          paths[`/${_plural}/:id`] = {};
        }
        paths[`/${_plural}/:id`].patch = {
          tags: [_name],
          summary: `修改单个${modelName}`,
          description: `修改单个${modelName}..`,
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
                $ref: `#/definitions/${modelKey}`,
              },
            },
          ],
          responses: {
            "200": {
              description: "修改成功",
            },
          },
        };
      }

      // 删除单条
      if (apis.includes("destroyByPk")) {
        if (!paths[`/${_plural}/:id`]) {
          paths[`/${_plural}/:id`] = {};
        }
        paths[`/${_plural}/:id`].delete = {
          tags: [_name],
          summary: `删除单个${modelName}`,
          description: `删除单个${modelName}..`,
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
        };
      }

      // 创建多条
      if (apis.includes("bulkCreate")) {
        if (!paths[`/${_plural}/multiple`]) {
          paths[`/${_plural}/multiple`] = {};
        }
        paths[`/${_plural}/multiple`].post = {
          tags: [_name],
          summary: `创建多个${modelName}`,
          description: `创建多个${modelName}...`,
          parameters: [
            {
              in: "body",
              name: "body",
              description: "body参数",
              schema: {
                type: "array",
                items: {
                  $ref: `#/definitions/${modelKey}`,
                },
              },
            },
          ],
          responses: {
            "200": {
              description: "创建成功",
            },
          },
        };
      }
    });

  return paths;
}
