const Loader = require("./Loader");
const { VueLoaderPlugin } = require("vue-loader");

module.exports = class Vue extends Loader {
  rules() {
    return {
      test: /\.vue$/,
      use: [
        ...this.loadIf(!this.env.isProduction, ["cache-loader"]),
        "vue-loader"
      ]
    };
  }

  plugin() {
    return new VueLoaderPlugin();
  }
};
