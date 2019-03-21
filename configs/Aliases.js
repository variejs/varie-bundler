const path = require("path");
const Config = require("./Config");
module.exports = class Extensions extends Config {
  register() {
    let webpackAliases = this.webpackChain.resolve.alias;
    for (let alias in this.options) {
      webpackAliases.set(
        alias,
        path.join(this.config.root, this.options[alias]),
      );
    }
  }
};
