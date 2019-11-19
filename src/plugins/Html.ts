import Plugin from "./Plugin";
import MultiBuildHtml from "./MultiBuild";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { HtmlWebpackPluginConfig } from "../interfaces/plugin-config-interfaces/HtmlWebpackPluginConfig";

export default class Copy extends Plugin<HtmlWebpackPluginConfig> {
  public register() {
    let config = {
      inject: true,
      template: "./index.html",
    };

    for (let variableName in this.options.variables) {
      config[variableName] = this.options.variables[variableName];
    }

    this.bundler.webpackChain.plugin("html").use(HtmlWebpackPlugin, [config]);

    if (this.bundler.env.isModern) {
      this.bundler.webpackChain.plugin("multi-build").use(MultiBuildHtml);
    }
  }
}
