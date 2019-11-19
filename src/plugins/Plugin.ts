import Bundler from "../interfaces/Bundler";

export default abstract class Plugin<T> {
  protected options: T;
  protected bundler: Bundler;

  constructor(bundler: Bundler, options?: T) {
    this.options = options;
    this.bundler = bundler;
    this.register();
  }

  abstract register(): void;
}
