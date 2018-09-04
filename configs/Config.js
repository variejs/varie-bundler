module.exports = class Config {
  constructor(varieBundler) {
    this.varieBundler = varieBundler;
    this.env = varieBundler._env;
    this.config = varieBundler._config;
    this.webpackChain = varieBundler._webpackChain;
    this.register();
  }
};
