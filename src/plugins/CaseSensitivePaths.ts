import Plugin from "./Plugin";
import CaseSensitivePathsPlugin from "case-sensitive-paths-webpack-plugin";

export default class CaseSensitivePaths extends Plugin<undefined> {
  public register() {
    this.varieBundler.webpackChain
      .plugin("case-sensitive-paths")
      .use(CaseSensitivePathsPlugin);
  }
}
