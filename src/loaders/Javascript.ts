import path from "path";
import Loader from "./Loader";

export default class Javascript extends Loader<{
  entryFiles: Array<string>;
}> {
  public register() {
    this.bundler.webpackChain.module
      .rule("js")
      .exclude.add((filepath) => {
        // always transpile js in vue files
        if (/\.vue\.jsx?$/.test(filepath)) {
          return false;
        }
        // Don't transpile node_modules
        return /node_modules/.test(filepath);
      })
      .end()
      .test(/\.jsx?$/)
      .use("thread-loader")
      .loader("thread-loader")
      .end()
      .use("babel-loader")
      .loader(path.join(__dirname, "BabelLoader"))
      .options({
        entryFiles: this.options.entryFiles,
      })
      .end();
  }
}
