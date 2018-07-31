const getDependency = require("./../helpers/getDependency");

module.exports = class BundleAnalyzer {
  constructor(config) {
    this.config = config;
  }

  boot() {
    if (this.config.isAnalyzing) {
      return new (getDependency(
        "webpack-bundle-analyzer"
      )).BundleAnalyzerPlugin();
    }
  }
};
