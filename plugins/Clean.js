const Plugin = require("./Plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = class Clean extends Plugin {
  boot() {
    if (!this.env.isHot) {
      return new CleanWebpackPlugin([this.config.outputPath], {
        root: this.config.root
      });
    }
  }
};
