const Plugin = require("./Plugin");
const { HashedModuleIdsPlugin } = require("webpack");
module.exports = class HashedModules extends Plugin {
  register() {
    this.webpackChain.plugin("hashed-modules").use(HashedModuleIdsPlugin, [
      {
        hashFunction: "sha256",
        hashDigest: "hex",
        hashDigestLength: 20,
      },
    ]);
  }
};
