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
      .use("babel-loader")
      .loader("babel-loader")
      .end()
      .use("typescript-loader")
      .loader("ts-loader")
      .options({
        appendTsSuffixTo: [/\.vue$/],
        transpileOnly: this.env.isHot || this.env.isProduction
      })
      .end();

    if (this.env.isHot) {
      this.webpackChain
        .plugin("typecript-checker")
        .use(ForkTsCheckerWebpackPlugin, [
          {
            vue: true,
            async: false,
            formatter: "codeframe",
            checkSyntacticErrors: true
          }
        ]);
    }
  }
};
