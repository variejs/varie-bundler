const Config = require("./Config");
module.exports = class Output extends Config {
  register() {
    let fileName = `js/[name]-[${this.config.hashType}]${
      this.env.isModern ? ".legacy" : ""
    }.js`;
    this.webpackChain.output
      .publicPath("/")
      .path(this.config.outputPath)
      .filename(fileName)
      .chunkFilename(fileName);
  }
};
