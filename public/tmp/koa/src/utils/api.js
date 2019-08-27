import rq from "./request";

/**
 * 
 * @param {object} qs 
 */
export async function fetchDemo(qs) {
  return rq({
    method: "GET",
    uri: "https://api.github.com/",
    // headers: {
    //   'User-Agent': 'Request-Promise',
    // },
    // qs: {
    //   foo: 'bar',
    // },
    // body: {
    //   some: 'payload',
    // },
    qs
  });
}

export default {
  fetchDemo
};
