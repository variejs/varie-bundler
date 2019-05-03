import Config from "./Config";
export default class Output<T> extends Config<undefined> {
  public register() {
    let fileName = `js/[name]-[${this.varieBundler.config.hashType}]${
      this.varieBundler.env.isModern ? ".legacy" : ""
    }.js`;
    this.varieBundler.webpackChain.output
      .publicPath("/")
      .path(this.varieBundler.config.outputPath)
      .filename(fileName)
      .chunkFilename(fileName);
  }
}
