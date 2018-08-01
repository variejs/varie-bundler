const Plugin = require("./Plugin");
let FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");

module.exports = class Errors extends Plugin {
  boot() {
    if (!this.env.isProduction) {
      return new FriendlyErrorsWebpackPlugin({
        clearConsole: true
      });
    }
  }
};
