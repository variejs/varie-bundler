const Loader = require("./Loader");

module.exports = class Images extends Loader {
  rules() {
    return {
      test: /\.(png|jpe?g|gif)$/,
      loaders: [
        {
          loader: "file-loader",
          options: {
            name: "img/[name].[ext]?[hash:8]"
          }
        },
        {
          loader: "img-loader",
          options: {
            enabled: this.config.isProduction,
            gifsicle: {},
            mozjpeg: {},
            optipng: {},
            svgo: {}
          }
        }
      ]
    };
  }
};
