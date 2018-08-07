module.exports = class Config {
  constructor(varieBundler) {
    this.varieBundler = varieBundler;
    this.config = varieBundler._config;
    this.webpackChain = varieBundler._webpackChain;
    this.register();
  }
};
