let FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");

module.exports = class Errors {
  constructor(config) {
    this.config = config;
  }

  boot() {
    if (!this.config.isProduction) {
      return new FriendlyErrorsWebpackPlugin({
        clearConsole: true
      });
    }
  }
};
