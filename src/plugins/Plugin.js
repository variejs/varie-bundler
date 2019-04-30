const getDependency = require("../helpers/getDependency");

module.exports = class Plugin {
  constructor(varieLoader, options = {}) {
    this.options = options;
    this.env = varieLoader._env;
    this.varieLoader = varieLoader;
    this.getDependency = getDependency;
    this.webpackChain = varieLoader._webpackChain;
    this.register();
  }
};
