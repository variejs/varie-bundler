import Plugin from "./Plugin";
import webpack from "webpack";

export default class AggressiveSplitting extends Plugin<{
  minSize: number;
  maxSize: number;
}> {
  public register() {
    this.bundler.webpackChain
      .plugin("aggressive-splitting")
      .use(webpack.optimize.AggressiveSplittingPlugin, [
        {
          minSize: this.options.minSize,
          maxSize: this.options.maxSize,
        },
      ]);
  }
}
