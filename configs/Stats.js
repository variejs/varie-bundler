const Config = require("./Config");
module.exports = class Extensions extends Config {
  register() {
    this.webpackChain.stats({
      hash: false,
      chunks: false,
      modules: false,
      source: false,
      reasons: false,
      version: false,
      timings: true,
      children: false,
      publicPath: false,
      errorDetails: false,
    });
  }
};
