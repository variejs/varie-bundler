const Plugin = require("./Plugin");
const Webpackbar = require("webpackbar");

module.exports = class WebpackBar extends Plugin {
  register() {
    this.webpackChain.plugin("webpackbar").use(Webpackbar, [
      {
        basic: false,
        name: this.options.name || "Client",
      },
    ]);
  }
};
