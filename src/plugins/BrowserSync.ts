import Plugin from "./Plugin";
import BrowserSyncPlugin from "browser-sync-webpack-plugin";
import { BrowserSyncPluginConfig } from "../interfaces/plugin-config-interfaces/BrowserSyncPluginConfig";

export default class BrowserSync extends Plugin<BrowserSyncPluginConfig> {
  public register() {
    this.varieBundler.webpackChain
      .plugin("browser-sync")
      .use(BrowserSyncPlugin, [
        {
          port: this.options.port,
          host: this.options.host,
          proxy: this.options.proxy,
          open: this.options.host === "0.0.0.0" ? "local" : "external",
          files: [
            this.options.outputPath + "/**/*.js",
            this.options.outputPath + "**/*.css",
          ],
        },
        { reload: false },
      ]);
  }
}
