import Config from "./Config";
export default class Output<T> extends Config<undefined> {
  public register() {
    let fileName = `js/[name]-[${this.bundler.config.hashType}].js`;
    this.bundler.webpackChain.output
      .publicPath("/")
      .path(this.bundler.config.outputPath)
      .filename(fileName)
      .chunkFilename(fileName);
  }
}
