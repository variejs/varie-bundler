import VarieBundler from "../index";

export default abstract class Config<T> {
  protected options: T;
  protected varieBundler: VarieBundler;

  constructor(varieBundler: VarieBundler, options?: T) {
    this.options = options;
    this.varieBundler = varieBundler;
    this.register();
  }

  abstract register(): void;
}
