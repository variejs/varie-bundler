import Plugin from "./Plugin";
let FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");

export default class Errors extends Plugin<undefined> {
  public register() {
    this.bundler.webpackChain
      .plugin("errors")
      .use(FriendlyErrorsWebpackPlugin, [
        {
          clearConsole: true,
        },
      ]);
  }
}
