import Plugin from "./Plugin";
import ESLintWebpackPlugin, { Options } from "eslint-webpack-plugin";

export default class Eslint extends Plugin<Options> {
  public register() {
    this.bundler.webpackChain
      .plugin("es-lint")
      .use(ESLintWebpackPlugin, [this.options]);
  }
}
