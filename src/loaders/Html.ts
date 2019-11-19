import Loader from "./Loader";

export default class Html extends Loader<undefined> {
  public register() {
    this.bundler.webpackChain.module
      .rule("html")
      .test(/\.html$/)
      .use("html-loader")
      .loader("html-loader")
      .options({
        minimize: true,
      });
  }
}
