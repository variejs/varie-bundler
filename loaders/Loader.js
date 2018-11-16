const useIf = require("./../helpers/useIf");

module.exports = class Loader {
  constructor(varieLoader) {
    this.useIf = useIf;
    this.varieLoader = varieLoader;
    this.env = this.varieLoader._env;
    this.config = this.varieLoader._config;
    this.webpackChain = this.varieLoader._webpackChain;
    this.register();
  }

  generateCacheConfig() {}
};
