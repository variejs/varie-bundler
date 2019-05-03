import path from "path";
import Loader from "./Loader";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin/lib/index";

export default class Typescript extends Loader<{
  modernBuild: boolean;
  entryFiles: Array<string>;
}> {
  public register() {
    this.varieBundler.webpackChain.module
      .rule("typescript")
      .test(/\.tsx?$/)
      .when(!this.varieBundler.env.isProduction, (config) => {
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
        transpileOnly:
          this.varieBundler.env.isHot || this.varieBundler.env.isProduction,
      })
      .end();

    if (
      this.varieBundler.env.isHot &&
      !this.varieBundler.webpackChain.plugins.has("ts-checker")
    ) {
      this.varieBundler.webpackChain
        .plugin("ts-checker")
        .use(ForkTsCheckerWebpackPlugin, [
          {
            vue: true,
            async: false,
            formatter: "codeframe",
            checkSyntacticErrors: true,
            workers: this.varieBundler.env.isHot
              ? 1
              : ForkTsCheckerWebpackPlugin.TWO_CPUS_FREE,
          },
        ]);
    }
  }
}
