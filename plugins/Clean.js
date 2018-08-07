const Plugin = require("./Plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = class Clean extends Plugin {
  register() {
    this.webpackChain.plugin("clean").use(CleanWebpackPlugin, [
      [this.config.outputPath],
      {
        root: this.config.root
      }
    ]);
  }
};
