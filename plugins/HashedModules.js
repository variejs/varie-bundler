const webpack = require("webpack");

module.exports = class HashedModules {
  constructor(config) {
    this.config = config;
  }

  boot() {
    if (this.config.isProduction) {
      return new webpack.HashedModuleIdsPlugin({
        hashFunction: "sha256",
        hashDigest: "hex",
        hashDigestLength: 20
      });
    }
  }
};
