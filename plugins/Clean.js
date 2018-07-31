const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = class Clean {
  constructor(config) {
    this.config = config;
  }

  boot() {
    if (!this.config.isHot) {
      return new CleanWebpackPlugin([this.config.outputPath], {
        root: this.config.root
      });
    }
  }
};
