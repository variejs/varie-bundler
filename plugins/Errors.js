const Plugin = require("./Plugin");
let FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");

module.exports = class Errors extends Plugin {
  register() {
    this.webpackChain.plugin("errors").use(FriendlyErrorsWebpackPlugin, [
      {
        clearConsole: true,
      },
    ]);
  }
};
