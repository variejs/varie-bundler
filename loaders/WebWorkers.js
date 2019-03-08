const Loader = require("./Loader");

module.exports = class WebWorkers extends Loader {
  register() {
    this.webpackChain.output.globalObject(
      `(typeof self !== 'undefined' ? self : this)`,
    );

    // TODO - https://github.com/webpack-contrib/worker-loader/issues/177
    // We have to wait till this issue goes away to turn this back on
    this.webpackChain.module.rule("js").uses.delete("thread-loader");

    this.webpackChain.module.rule("typescript").uses.delete("thread-loader");

    this.webpackChain.module.rule("js").exclude.add(/\.worker\.js$/);
    this.webpackChain.module.rule("typescript").exclude.add(/\.worker\.js$/);

    this.webpackChain.module
      .rule("workers")
      .test(/\.worker\.js$/)
      .use("worker-loader")
      .loader("worker-loader")
      .end()
      .use("babel")
      .loader("babel-loader")
      .end();

    this.webpackChain.module
      .rule("type-script-service-workers")
      .test(/\.worker\.tsx?$/)
      .use("babel")
      .loader("babel-loader")
      .end()
      .use("ts-loader")
      .loader("ts-loader")
      .options({
        happyPackMode: true,
        transpileOnly: this.env.isHot || this.env.isProduction,
      })
      .end();

    this.webpackChain.module
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

    this.webpackChain.module
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
        transpileOnly: this.env.isHot || this.env.isProduction,
      })
      .end();
  }
};
