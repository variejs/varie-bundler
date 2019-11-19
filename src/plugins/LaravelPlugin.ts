import Plugin from "./Plugin";
import Manifest from "./Manifest";

// TODO
export default class LaravelPlugin extends Plugin<undefined> {
  public register() {
    this.bundler.webpackChain.plugins.delete("html");
    // this.webpackChain.devServer.
    new Manifest(this.bundler);
  }
}
