const Loader = require("./Loader");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

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
        appendTsSuffixTo: [/\.vue$/],
        transpileOnly: this.env.isProduction
      })
      .end()
      .exclude.add(/node_modules/);

    if (this.env.isHot) {
      this.webpackChain
        .plugin("typecript-checker")
        .use(ForkTsCheckerWebpackPlugin, [
          {
            checkSyntacticErrors: true
          }
        ]);
    }
  }
};
