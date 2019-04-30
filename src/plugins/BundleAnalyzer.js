const Plugin = require("./Plugin");

module.exports = class BundleAnalyzer extends Plugin {
  register() {
    this.webpackChain
      .plugin("analyzer")
      .use(this.getDependency("webpack-bundle-analyzer").BundleAnalyzerPlugin);
  }
};
