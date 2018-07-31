const { VueLoaderPlugin } = require("vue-loader");
const loadIf = require("./../build/helpers/loadIf");

module.exports = class Typescript {
  constructor(config) {
    this.config = config;
  }

  rules() {
    return {
      test: /\.vue$/,
      use: [
        ...loadIf(!this.config.isProduction, ["cache-loader"]),
        "vue-loader"
      ]
    };
  }

  plugin() {
    return new VueLoaderPlugin();
  }
};
