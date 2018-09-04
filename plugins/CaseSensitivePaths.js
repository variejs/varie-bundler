const Plugin = require("./Plugin");
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

module.exports = class CaseSensitivePaths extends Plugin {
  register() {
    this.webpackChain.plugin("case-sensitive-paths").use(CaseSensitivePathsPlugin);
  }
};
