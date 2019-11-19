import Config from "./Config";

export default class Extensions<T> extends Config<undefined> {
  public register() {
    this.bundler.webpackChain.resolve.extensions
      .add(".js")
      .add(".jsx")
      .add(".ts")
      .add(".tsx")
      .add(".vue")
      .add(".json")
      .end();
  }
}
