const Loader = require("./Loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = class Html extends Loader {
  rules() {
    return {
      test: /\.html$/,
      loaders: ["html-loader"]
    };
  }

  plugin() {
    return new HtmlWebpackPlugin({
      template: "./index.html"
    });
  }
};
