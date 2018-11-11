const Loader = require("./Loader");

module.exports = class Javascript extends Loader {
  register() {
    this.webpackChain.module
      .rule("js")
      .test(/\.jsx?$/)
      .when(this.env.isHot, config => {
        config.use("cache").loader("cache-loader");
      })
      .use("babel-loader")
      .loader("babel-loader")
      .end();

    // .use('thread-loader')
  }
};
