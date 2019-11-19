import Loader from "./Loader";

export default class Images extends Loader<undefined> {
  public register() {
    this.bundler.webpackChain.module
      .rule("images")
      .exclude.add(/fonts/)
      .end()
      .test(/\.(png|jpe?g|gif|svg)$/)
      .use("file-loader")
      .loader("file-loader")
      .options({
        name: "images/[name].[ext]?[hash:8]",
      })
      .end()
      .use("image-webpack-loader")
      .loader("image-webpack-loader")
      .options({
        mozjpeg: {
          progressive: true,
          quality: 75,
        },
        optipng: {
          optimizationLevel: 3,
        },
        pngquant: {
          quality: [0.75, 0.9],
          speed: 4,
        },
        gifsicle: {
          interlaced: true,
        },
        disable: !this.bundler.env.isProduction,
      });
  }
}
