const Plugin = require("./Plugin");
const PreloadPlugin = require("@vue/preload-webpack-plugin");
module.exports = class Preload extends Plugin {
  register() {
    this.webpackChain
      .plugin("preload")
      .use(PreloadPlugin, [
        {
          rel: "preload",
          include: "initial",
          fileBlacklist: [/\.map$/, /hot-update\.js$/],
        },
      ])
      .before("multi-build");

    this.webpackChain
      .plugin("prefetch")
      .use(PreloadPlugin, [
        {
          rel: "prefetch",
          include: "asyncChunks",
        },
      ])
      .before("multi-build");
  }
};
