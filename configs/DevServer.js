const Config = require("./Config");
module.exports = class DevServer extends Config {
  register() {
    this.webpackChain.devServer
      .quiet(true)
      .noInfo(true)
      .overlay(true)
      .compress(true)
      .host(this.config.host)
      .historyApiFallback(true)
      .contentBase(this.config.root)
      .headers({
        "Access-Control-Allow-Origin": "*"
      });
  }
};
