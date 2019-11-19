import Loader from "./Loader";

export default class WebWorkers extends Loader<undefined> {
  public register() {
    this.bundler.webpackChain.output.globalObject(
      `(typeof self !== 'undefined' ? self : this)`,
    );

    // TODO - https://github.com/webpack-contrib/worker-loader/issues/177
    // Turn thread loaders off
    this.bundler.webpackChain.module.rule("js").uses.delete("thread-loader");

    this.bundler.webpackChain.module
      .rule("typescript")
      .uses.delete("thread-loader");

    this.bundler.webpackChain.module.rule("js").exclude.add(/\.worker\.js$/);
    this.bundler.webpackChain.module
      .rule("typescript")
      .exclude.add(/\.worker\.js$/);

    this.bundler.webpackChain.module
      .rule("workers")
      .test(/\.worker\.js$/)
      .use("worker-loader")
      .loader("worker-loader")
      .end()
      .use("babel")
      .loader("babel-loader")
      .end();

    this.bundler.webpackChain.module
      .rule("type-script-service-workers")
      .test(/\.worker\.tsx?$/)
      .use("babel")
      .loader("babel-loader")
      .end()
      .use("ts-loader")
      .loader("ts-loader")
      .options({
        happyPackMode: true,
        transpileOnly: this.bundler.env.isHot || this.bundler.env.isProduction,
      })
      .end();

    this.bundler.webpackChain.module
      .rule("service-workers")
      .test(/\.service-worker\.js$/)
      .use("file")
      .loader("file-loader")
      .options({
        name: "service-workers/[name].js",
      })
      .end()
      .use("babel")
      .loader("babel-loader")
      .end();

    this.bundler.webpackChain.module
      .rule("type-script-service-workers")
      .test(/\.service-worker\.tsx?$/)
      .use("file")
      .loader("file-loader")
      .options({
        name: "service-workers/[name].js",
      })
      .end()
      .use("babel")
      .loader("babel-loader")
      .end()
      .use("ts-loader")
      .loader("ts-loader")
      .options({
        happyPackMode: true,
        transpileOnly: this.bundler.env.isHot || this.bundler.env.isProduction,
      })
      .end();
  }
}
