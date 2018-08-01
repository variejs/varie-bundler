const Plugin = require("./Plugin");

module.exports = class BundleAnalyzer extends Plugin {
  boot() {
    if (this.env.isAnalyzing) {
      return new (this.getDependency(
        "webpack-bundle-analyzer"
      )).BundleAnalyzerPlugin();
    }
  }
};
