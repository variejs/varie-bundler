import Plugin from "./Plugin";
import ManifestPlugin from "webpack-manifest-plugin";

export default class Manifest extends Plugin<undefined> {
  public register() {
    this.bundler.webpackChain.plugin("manifest").use(ManifestPlugin, [
      {
        writeToFileEmit: true,
      },
    ]);
  }
}
