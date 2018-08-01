const Loader = require("./Loader");
const autoprefixer = require("autoprefixer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = class Sass extends Loader {
  rules() {
    return {
      test: /\.s[ac]ss|\.css/,
      use: [
        ...this.loadIf(!this.env.isProduction, ["cache-loader"]),
        {
          loader: this.env.isHot ? "style-loader" : MiniCssExtractPlugin.loader
        },
        {
          loader: "css-loader",
          options: {
            sourceMap: true,
            importLoaders: 1,
            minimize: this.env.isProduction
          }
        },
        {
          loader: "postcss-loader",
          options: {
            sourceMap: true,
            ident: "postcss",
            autoprefixer: {
              browsers: ["last 2 versions"]
            },
            plugins: () => [autoprefixer]
          }
        },
        {
          loader: "resolve-url-loader",
          options: {
            sourceMap: true
          }
        },
        {
          loader: "sass-loader",
          options: {
            sourceMap: true
          }
        }
      ]
    };
  }

  plugin() {
    if (!this.env.isHot) {
      return new MiniCssExtractPlugin({
        filename: `css/[name].css?[${this.config.hashType}]`,
        chunkFilename: `css/[name].css?[${this.config.hashType}]`
      });
    }
  }
};
