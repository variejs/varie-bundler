module.exports = class Config {
  constructor(varieBundler, options) {
    this.options = options;
    this.varieBundler = varieBundler;
    this.env = varieBundler._env;
    this.config = varieBundler._config;
    this.webpackChain = varieBundler._webpackChain;
    this.register();
  }
};
