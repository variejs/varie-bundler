import Plugin from "./Plugin";
import Manifest from "./Manifest";

// TODO
export default class LaravelPlugin extends Plugin<undefined> {
  public register() {
    this.varieBundler.webpackChain.plugins.delete("html");
    // this.webpackChain.devServer.
    new Manifest(this.varieBundler);
  }
}
