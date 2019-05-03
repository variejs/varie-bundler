import Config from "./Config";

export default class Stats<T> extends Config<undefined> {
  public register() {
    this.varieBundler.webpackChain.stats({
      hash: false,
      chunks: false,
      modules: false,
      source: false,
      reasons: false,
      version: false,
      timings: true,
      children: false,
      publicPath: false,
      errorDetails: false,
    });
  }
}
