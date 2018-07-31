const Loader = require("./Loader");
const loadIf = require("./../helpers/loadIf");
const { VueLoaderPlugin } = require("vue-loader");

module.exports = class Vue extends Loader {
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
