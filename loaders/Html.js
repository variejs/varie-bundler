const Loader = require("./Loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = class Html extends Loader {
  register() {
    this.webpackChain.module
      .rule("html")
      .test(/\.html$/)
      .use("html")
      .loader("html-loader")
      .options({
        limit: 4096,
        name: "fonts/[name].[ext]?[hash:8]"
      });

    this.webpackChain.plugin("html").use(HtmlWebpackPlugin, [
      {
        template: "./index.html"
      }
    ]);
  }
};
