const Config = require("./Config");
module.exports = class Output extends Config {
  register() {
    this.webpackChain.output
      .publicPath('/')
      .path(this.config.outputPath)
      .filename(`js/[name]-[${this.config.hashType}].js`)
      .chunkFilename(`js/[name]-[${this.config.hashType}].js`);
  }
};
