import Loader from "./Loader";
export default class Fonts extends Loader<undefined> {
  public register() {
    this.varieBundler.webpackChain.module
      .rule("fonts")
      .test(/\.(woff|woff2|ttf|eot|svg|otf)$/)
      .use("file-loader")
      .loader("file-loader")
      .options({
        limit: 4096,
        name: "fonts/[name].[ext]?[hash:8]",
      });
  }
}
