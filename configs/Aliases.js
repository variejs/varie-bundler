const Config = require("./Config");
module.exports = class Extensions extends Config {
  register() {
    let webpackAliases = this.webpackChain.resolve.alias;
    for (let alias in this.varieBundler._aliases) {
      webpackAliases.set(alias, this.varieBundler._aliases[alias]);
    }
  }
};
