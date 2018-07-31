module.exports = class Fonts {
  constructor(config) {
    this.config = config;
  }

  rules() {
    return {
      test: /\.(woff|woff2|ttf|eot|svg|otf)$/,
      loader: "file-loader",
      options: {
        limit: 4096,
        name: "fonts/[name].[ext]?[hash:8]"
      }
    };
  }
};
