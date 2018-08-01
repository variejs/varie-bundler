const Loader = require("./Loader");
const { VueLoaderPlugin } = require("vue-loader");

module.exports = class Vue extends Loader {
  rules() {
    return {
      test: /\.vue$/,
      use: [
        ...this.useIf(!this.env.isProduction, ["cache-loader"]),
        "vue-loader"
      ]
    };
  }

  plugins() {
    return [new VueLoaderPlugin()];
  }
};
