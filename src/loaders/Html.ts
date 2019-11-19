import Loader from "./Loader";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MultiBuildHtml from "./../plugins/MultiBuild";

export default class Html extends Loader<undefined> {
  public register() {
    this.bundler.webpackChain.module
      .rule("html")
      .test(/\.html$/)
      .use("html-loader")
      .loader("html-loader")
      .options({
        limit: 4096,
        name: "fonts/[name].[ext]?[hash:8]",
      });

    this.bundler.webpackChain.plugin("html").use(HtmlWebpackPlugin, [
      {
        inject: true,
        template: "./index.html",
      },
    ]);

    if (this.bundler.env.isModern) {
      this.bundler.webpackChain.plugin("multi-build").use(MultiBuildHtml);
    }
  }
}
