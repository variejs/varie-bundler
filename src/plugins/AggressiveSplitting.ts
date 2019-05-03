import Plugin from "./Plugin";
import webpack from "webpack";

export default class AggressiveSplitting extends Plugin<{
  minSize: Number;
  maxSize: Number;
}> {
  public register() {
    this.varieBundler.webpackChain
      .plugin("agressive-splitting")
      .use(webpack.optimize.AggressiveSplittingPlugin, [
        {
          minSize: this.options.minSize,
          maxSize: this.options.maxSize,
        },
      ]);
  }
}
