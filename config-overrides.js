module.exports = function override(config, env) {
  config.resolve = {
    alias: {
      handlebars: "handlebars/dist/handlebars.js",
    },
  };
  return config;
};
