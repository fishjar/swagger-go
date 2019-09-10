import rq from "./request";

/**
 * 请求示例
 * @param {object} qs
 */
export const fetchTest = qs => {
  return rq({
    method: "GET",
    uri: "https://api.github.com",
    headers: {
      'User-Agent': 'Request-Promise',
    },
    // qs: {
    //   foo: 'bar',
    // },
    // body: {
    //   some: 'payload',
    // },
    qs,
  });
};

export default {
  fetchTest,
};
