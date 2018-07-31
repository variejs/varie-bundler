const BrowserSyncPlugin = require("browser-sync-webpack-plugin");

module.exports = class BrowserSync {
  constructor(config) {
    this.config = config;
  }

  boot() {
    return new BrowserSyncPlugin(
      {
        open: this.config.host ? "external" : "local",
        host: this.config.host,
        proxy: this.config.isHot ? "http://localhost:8080/" : this.config.host,
        files: [
          this.config.outputPath + "/**/*.js",
          this.config.outputPath + "**/*.css"
        ]
      },
      { reload: false }
    );
  }
};
