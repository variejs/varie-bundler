import Config from "./Config";
import { WebpackDevServerConfig } from "../interfaces/web-config-interfaces/WebpackDevServerConfig";

export default class DevServer<T> extends Config<WebpackDevServerConfig> {
  public register() {
    this.varieBundler.webpackChain.devServer
      .quiet(true)
      .noInfo(true)
      .overlay(true)
      .compress(true)
      .host(this.options.host)
      .historyApiFallback(true)
      .contentBase(this.varieBundler.config.root)
      .headers({
        "Access-Control-Allow-Origin": "*",
      })
      .open(this.options.open)
      .proxy(this.options.proxies);
  }
}
