const Plugin = require("./Plugin");

module.exports = class HashedModules extends Plugin {
  register() {
    this.webpackChain
      .plugin("hashed-modules")
      .use(this.webpack.HashedModuleIdsPlugin, [
        {
          hashFunction: "sha256",
          hashDigest: "hex",
          hashDigestLength: 20
        }
      ]);
  }
};
