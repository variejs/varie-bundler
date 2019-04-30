const Config = require("./Config");
module.exports = class DevServer extends Config {
  register() {
    this.webpackChain.devServer
      .quiet(true)
      .noInfo(true)
      .overlay(true)
      .compress(true)
      .host(this.options.host)
      .historyApiFallback(true)
      .contentBase(this.config.root)
      .headers({
        "Access-Control-Allow-Origin": "*",
      })
      .open(this.options.open)
      .proxy(this.options.proxies);
  }
};
