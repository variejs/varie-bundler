import Plugin from "./Plugin";
import PreloadPlugin from "@vue/preload-webpack-plugin";
export default class Preload extends Plugin<undefined> {
  public register() {
    this.bundler.webpackChain
      .plugin("preload")
      .use(PreloadPlugin, [
        {
          rel: "preload",
          include: "initial",
          fileBlacklist: [/\.map$/, /hot-update\.js$/],
        },
      ])
      .before("multi-build");

    this.bundler.webpackChain
      .plugin("prefetch")
      .use(PreloadPlugin, [
        {
          rel: "prefetch",
          include: "asyncChunks",
        },
      ])
      .before("multi-build");
  }
}
