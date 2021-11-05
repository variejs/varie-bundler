import Plugin from "./Plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { HtmlWebpackPluginConfig } from "../interfaces/plugin-config-interfaces/HtmlWebpackPluginConfig";

export default class Html extends Plugin<HtmlWebpackPluginConfig> {
  public register() {
    let config = {
      inject: true,
      template: "./index.html",
    };

    if (this.options && this.options.variables) {
      for (let variableName in this.options.variables) {
        config[variableName] = this.options.variables[variableName];
      }
    }

    this.bundler.webpackChain.plugin("html").use(HtmlWebpackPlugin, [config]);
  }
}
