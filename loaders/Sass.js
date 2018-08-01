const Loader = require("./Loader");
const cssnano = require("cssnano");
const useIf = require("./../helpers/useIf");
const autoprefixer = require("autoprefixer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = class Sass extends Loader {
  rules() {
    return {
      test: /\.s[ac]ss|\.css/,
      use: [
        ...this.useIf(this.env.isHot, ["cache-loader"]),
        {
          loader: this.env.isHot ? "style-loader" : MiniCssExtractPlugin.loader
        },
        {
          loader: "css-loader",
          options: {
            sourceMap: true,
            importLoaders: 1
          }
        },
        {
          loader: "postcss-loader",
          options: {
            sourceMap: true,
            ident: "postcss",
            plugins: () => [
              autoprefixer,
              ...this.useIf(this.env.isHot, [cssnano])
            ]
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
            sourceMap: true,
            fiber: require("fibers"),
            implementation: require("dart-sass")
          }
        }
      ]
    };
  }

  plugins() {
    if (!this.env.isHot) {
      return [
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            map: {
              inline: false,
              annotation: true
            }
          },
          canPrint: !this.env.isProduction
        }),
        new MiniCssExtractPlugin({
          filename: `css/[name]-[${this.config.hashType}].css`,
          chunkFilename: `css/[name]-[${this.config.hashType}].css`
        })
      ];
    }
  }
};
