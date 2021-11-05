import Config from "./Config";
import portFinderSync from "portfinder-sync";
import { WebpackDevServerConfig } from "../interfaces/web-config-interfaces/WebpackDevServerConfig";

export default class DevServer<T> extends Config<WebpackDevServerConfig> {
  public async register() {
    let port = portFinderSync.getPort(
      this.bundler.config.webpack.devServer.port,
    );
    this.bundler.webpackChain.devServer
      .port(port)
      .host("0.0.0.0")
      .historyApiFallback(true)
      .headers({
        "Access-Control-Allow-Origin": "*",
      })
      .open(this.options.open)
      .proxy(this.options.proxies);
  }
}
