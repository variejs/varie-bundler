const Loader = require("./Loader");

module.exports = class Typescript extends Loader {
  register() {
    this.webpackChain.module
      .rule("typescript")
      .test(/\.tsx?$/)
      .when(this.env.isHot, config => {
        config.use("cache").loader("cache-loader");
      })
      .use("babel")
      .loader("babel-loader")
      .end()
      .use("typescript")
      .loader("ts-loader")
      .options({
        appendTsSuffixTo: [/\.vue$/]
      })
      .end()
      .exclude.add(/node_modules/);
  }
};
