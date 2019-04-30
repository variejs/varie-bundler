const Plugin = require("./Plugin");
const Manifest = require("./Manifest");
module.exports = class LaravelPlugin extends Plugin {
  register() {
    this.webpackChain.plugins.delete("html");
    // this.webpackChain.devServer.
    new Manifest(this.varieLoader);
  }
};
