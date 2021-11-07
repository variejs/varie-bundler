import path from "path";
import Loader from "./Loader";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin/lib/index";

export default class Typescript extends Loader<{
  entryFiles: Array<string>;
}> {
  public register() {
    this.bundler.webpackChain.module
      .rule("typescript")
      .test(/\.tsx?$/)
      .use("thread-loader")
      .loader("thread-loader")
      .end()
      .use("babel-loader")
      .loader(path.join(__dirname, "BabelLoader"))
      .options({
        entryFiles: this.options.entryFiles,
      })
      .end()
      .use("ts-loader")
      .loader("ts-loader")
      .options({
        happyPackMode: true,
        appendTsSuffixTo: [/\.vue$/],
        transpileOnly: this.bundler.env.isHot || this.bundler.env.isProduction,
      })
      .end();

    if (
      this.bundler.env.isHot &&
      !this.bundler.webpackChain.plugins.has("ts-checker")
    ) {
      this.bundler.webpackChain
        .plugin("ts-checker")
        .use(ForkTsCheckerWebpackPlugin, [
          {
            typescript: {
              extensions: {
                vue: true,
              },
            },
          },
        ]);
    }
  }
}
