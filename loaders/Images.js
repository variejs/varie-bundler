module.exports = class Images {
  constructor(config) {
    this.config = config;
  }

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
