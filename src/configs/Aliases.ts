import path from "path";
import Config from "./Config";

export default class Aliases<T> extends Config<Array<string>> {
  public register() {
    let webpackAliases = this.varieBundler.webpackChain.resolve.alias;
    for (let alias in this.options) {
      webpackAliases.set(
        alias,
        path.join(this.varieBundler.config.root, this.options[alias]),
      );
    }
  }
}
