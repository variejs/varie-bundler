const Loader = require("./Loader");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = class Typescript extends Loader {
  register() {
    this.webpackChain.module
      .rule("typescript")
      .test(/\.tsx?$/)
      .when(!this.env.isProduction, config => {
        config
          .use("cache")
          .loader("cache-loader")
          .options(
            this.generateCacheConfig(
              "ts-loader",
              ["ts-loader", "typescript"],
              ["babel.config.js", "tsconfig.json"]
            )
          );
      })
      .use("thread-loader")
      .loader("thread-loader")
      .end()
      .use("babel-loader")
      .loader("babel-loader")
      .end()
      .use("typescript-loader")
      .loader("ts-loader")
      .options({
        happyPackMode: true,
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
