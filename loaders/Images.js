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
      .use("image-webpack-loader")
      .loader("image-webpack-loader")
      .options({
        mozjpeg: {
          progressive: true,
          quality: 75
        },
        optipng: {
          enabled: true
        },
        pngquant: {
          quality: "75-90",
          speed: 4
        },
        gifsicle: {
          interlaced: true
        },
        webp: {
          quality: 75
        },
        disable: !this.env.isProduction
      });
  }
};
