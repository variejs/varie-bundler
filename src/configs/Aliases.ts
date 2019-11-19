import path from "path";
import Config from "./Config";

export default class Aliases<T> extends Config<{ [key: string]: string }> {
  public register() {
    let webpackAliases = this.bundler.webpackChain.resolve.alias;
    for (let alias in this.options) {
      webpackAliases.set(
        alias,
        path.join(this.bundler.config.root, this.options[alias]),
      );
    }
  }
}
