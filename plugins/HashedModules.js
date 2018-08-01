const Plugin = require("./Plugin");

module.exports = class HashedModules extends Plugin {
  boot() {
    if (this.env.isProduction) {
      return new this.webpack.HashedModuleIdsPlugin({
        hashFunction: "sha256",
        hashDigest: "hex",
        hashDigestLength: 20
      });
    }
  }
};
