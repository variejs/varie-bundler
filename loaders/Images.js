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
      .use("img-loader")
      .loader("img-loader")
      .options({
        svgo: {
          plugins: [{ convertPathData: false }]
        },
        mozjpeg: {
          progressive: true,
          arithmetic: false
        },
        optipng: {
          optimizationLevel: 5
        },
        gifsicle: {
          interlaced: true
        },
        enabled: this.env.isProduction
      });
  }
};
