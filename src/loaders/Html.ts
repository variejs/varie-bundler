import Loader from "./Loader";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MultiBuildHtml from "./../plugins/MultiBuild";

export default class Html extends Loader<undefined> {
  public register() {
    this.varieBundler.webpackChain.module
      .rule("html")
      .test(/\.html$/)
      .use("html-loader")
      .loader("html-loader")
      .options({
        limit: 4096,
        name: "fonts/[name].[ext]?[hash:8]",
      });

    this.varieBundler.webpackChain.plugin("html").use(HtmlWebpackPlugin, [
      {
        inject: true,
        template: "./index.html",
      },
    ]);

    if (this.varieBundler.env.isModern) {
      this.varieBundler.webpackChain.plugin("multi-build").use(MultiBuildHtml);
    }
  }
}
