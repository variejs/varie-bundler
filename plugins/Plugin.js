const webpack = require("webpack");
const getDependency = require("./../helpers/getDependency");

module.exports = class Plugin {
  constructor(varieLoader, modernBuild = false) {
    this.webpack = webpack;
    this.modernBuild = modernBuild;
    this.varieLoader = varieLoader;
    this.env = this.varieLoader._env;
    this.getDependency = getDependency;
    this.config = this.varieLoader._config;
    this.webpackChain = this.varieLoader._webpackChain;
    this.register();
  }
};
