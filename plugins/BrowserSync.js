const Plugin = require("./Plugin");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");

module.exports = class BrowserSync extends Plugin {
  register() {
    this.webpackChain.plugin("browser-sync").use(BrowserSyncPlugin, [
      {
        port: this.options.port,
        host: this.options.host,
        proxy: this.options.proxy,
        open: this.options.host ? "external" : "local",
        files: [
          this.options.outputPath + "/**/*.js",
          this.options.outputPath + "**/*.css",
        ],
      },
      { reload: false },
    ]);
  }
};
