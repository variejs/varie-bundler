import Loader from "./Loader";
export default class Fonts extends Loader<undefined> {
  public register() {
    this.bundler.webpackChain.module
      .rule("fonts")
      .exclude.add(/images/)
      .add(/img/)
      .end()
      .test(/\.(woff|woff2|ttf|eot|otf|svg)$/)
      // @ts-ignore
      .type("asset/resource");
  }
}
