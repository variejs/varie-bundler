import Loader from "./Loader";

export default class Eslint extends Loader<undefined> {
  public register() {
    this.varieBundler.webpackChain.module
      .rule("js")
      .use("eslint-loader")
      .loader("eslint-loader")
      .options({
        cache: true,
      })
      .after("babel-loader");
  }
}
