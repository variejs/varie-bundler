const Plugin = require("./Plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = class Copy extends Plugin {
  register() {
    this.webpackChain.plugin("copy").use(CopyWebpackPlugin, [this.options]);
  }
};
