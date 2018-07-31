const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = class Fonts {
  constructor(config) {
    this.config = config;
  }

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
