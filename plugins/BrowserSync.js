const Plugin = require("./Plugin");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");

module.exports = class BrowserSync extends Plugin {
  register() {
    this.webpackChain.plugin("browser-sync").use(BrowserSyncPlugin, [
      {
        host: this.config.host,
        open: this.config.host ? "external" : "local",
        proxy: this.env.isHot ? `http://localhost:8080` : this.config.host,
        files: [
          this.config.outputPath + "/**/*.js",
          this.config.outputPath + "**/*.css"
        ]
      },
      { reload: false }
    ]);
  }
};
