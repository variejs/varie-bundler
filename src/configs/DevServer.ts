import Config from "./Config";
import portFinderSync from "portfinder-sync";
import { WebpackDevServerConfig } from "../interfaces/web-config-interfaces/WebpackDevServerConfig";

export default class DevServer<T> extends Config<WebpackDevServerConfig> {
  public async register() {
    let port = portFinderSync.getPort(
      this.bundler.config.webpack.devServer.port,
    );
    this.bundler.webpackChain.devServer
      .quiet(true)
      .noInfo(true)
      .overlay(true)
      .compress(true)
      .public(
        `${
          this.options.host === "0.0.0.0" ? "localhost" : this.options.host
          // @ts-ignore
        }:${port}`,
      )
      .port(port)
      .host("0.0.0.0")
      .historyApiFallback(true)
      .contentBase(this.bundler.config.root)
      .headers({
        "Access-Control-Allow-Origin": "*",
      })
      .open(this.options.open)
      .proxy(this.options.proxies);
  }
}
