const Plugin = require("./Plugin");
const ManifestPlugin = require("webpack-manifest-plugin");

module.exports = class Manifest extends Plugin {
  register() {
    this.webpackChain.plugin("manifest").use(ManifestPlugin, [
      {
        writeToFileEmit: true,
      },
    ]);
  }
};
