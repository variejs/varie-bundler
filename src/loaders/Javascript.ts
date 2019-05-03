import path from "path";
import Loader from "./Loader";

export default class Javascript extends Loader<{
  modernBuild: boolean;
  entryFiles: Array<string>;
}> {
  public register() {
    this.varieBundler.webpackChain.module
      .rule("js")
      .exclude.add((filepath) => {
        // always transpile js in vue files
        if (/\.vue\.jsx?$/.test(filepath)) {
          return false;
        }
        // Don't transpile node_modules
        return /node_modules/.test(filepath);
      })
      .end()
      .test(/\.jsx?$/)
      .use("thread-loader")
      .loader("thread-loader")
      .end()
      .when(!this.varieBundler.env.isProduction, (config) => {
        config
          .use("cache-loader")
          .loader("cache-loader")
          .options(
            this.generateCacheConfig(
              "js",
              ["@babel/runtime-corejs3", "babel-loader", "core-js"],
              ["babel.config.js", ".browserslistrc"],
            ),
          );
      })
      .use("babel-loader")
      .loader(path.join(__dirname, "BabelLoader"))
      .options({
        entryFiles: this.options.entryFiles,
        modernBuild: this.options.modernBuild,
      })
      .end();
  }
}
