const Loader = require("./Loader");

module.exports = class Images extends Loader {
  register() {
    this.webpackChain.module
      .rule("images")
      .test(/\.(png|jpe?g|gif)$/)
      .use("file")
      .loader("file-loader")
      .options({
        name: "img/[name].[ext]?[hash:8]"
      })
      .end()
      .use("img")
      .loader("img-loader")
      .options({
        svgo: {},
        mozjpeg: {},
        optipng: {},
        gifsicle: {},
        enabled: this.env.isProduction
      });
  }
};
