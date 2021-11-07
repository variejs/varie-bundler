import Plugin from "./Plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import { CopyPluginConfig } from "../interfaces/plugin-config-interfaces/CopyPluginConfig";

export default class Copy extends Plugin<CopyPluginConfig> {
  public register() {
    this.bundler.webpackChain.plugin("copy").use(CopyWebpackPlugin, [
      {
        patterns: this.options.patterns,
      },
    ]);
  }
}
