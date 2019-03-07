const Loader = require("./Loader");
const MultiBuild = require("./../plugins/MultiBuild");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = class Html extends Loader {
  register() {
    this.webpackChain.module
      .rule("html")
      .test(/\.html$/)
      .use("html-loader")
      .loader("html-loader")
      .options({
        limit: 4096,
        name: "fonts/[name].[ext]?[hash:8]",
      });

    this.webpackChain.plugin("html").use(HtmlWebpackPlugin, [
      {
        inject: true,
        template: "./index.html",
      },
    ]);

    if (this.env.isModern) {
      this.webpackChain.plugin("multi-build").use(MultiBuild);
    }
  }
};
