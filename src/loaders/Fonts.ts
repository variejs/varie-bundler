import Loader from "./Loader";
export default class Fonts extends Loader<undefined> {
  public register() {
    this.varieBundler.webpackChain.module
      .rule("fonts")
      .exclude.add(/images/)
      .add(/img/)
      .end()
      .test(/\.(woff|woff2|ttf|eot|otf|svg)$/)
      .use("file-loader")
      .loader("file-loader")
      .options({
        limit: 4096,
        name: "fonts/[name].[ext]?[hash:8]",
      });
  }
}
