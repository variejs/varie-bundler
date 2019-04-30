const path = require("path");
const Loader = require("./Loader");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin/lib/index");

module.exports = class Typescript extends Loader {
  register() {
    this.webpackChain.module
      .rule("typescript")
      .test(/\.tsx?$/)
      .when(!this.env.isProduction, (config) => {
        config
          .use("cache-loader")
          .loader("cache-loader")
          .options(
            this.generateCacheConfig(
              "ts-loader",
              ["ts-loader", "typescript"],
              ["babel.config.js", "tsconfig.json"],
            ),
          );
      })
      .use("thread-loader")
      .loader("thread-loader")
      .end()
      .use("babel-loader")
      .loader(path.join(__dirname, "BabelLoader"))
      .options({
        entryFiles: this.options.entryFiles,
        modernBuild: this.options.modernBuild,
      })
      .end()
      .use("ts-loader")
      .loader("ts-loader")
      .options({
        happyPackMode: true,
        appendTsSuffixTo: [/\.vue$/],
        transpileOnly: this.env.isHot || this.env.isProduction,
      })
      .end();

    if (this.env.isHot && !this.webpackChain.plugins.has("ts-checker")) {
      this.webpackChain.plugin("ts-checker").use(ForkTsCheckerWebpackPlugin, [
        {
          vue: true,
          async: false,
          formatter: "codeframe",
          checkSyntacticErrors: true,
          workers: this.env.isHot
            ? 1
            : ForkTsCheckerWebpackPlugin.TWO_CPUS_FREE,
        },
      ]);
    }
  }
};
