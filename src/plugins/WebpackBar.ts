import Plugin from "./Plugin";
import Webpackbar from "webpackbar";
import { WebpackBarConfig } from "../interfaces/plugin-config-interfaces/WebpackBarConfig";

export default class WebpackBar extends Plugin<WebpackBarConfig> {
  public register() {
    this.bundler.webpackChain.plugin("webpackbar").use(Webpackbar, [
      {
        name: `${this.options.name || "Client"} Bundle`,
      },
    ]);
  }
}
