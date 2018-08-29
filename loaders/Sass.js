const Loader = require("./Loader");
const cssnano = require("cssnano");
const autoprefixer = require("autoprefixer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = class Sass extends Loader {
  register() {
    this.webpackChain.module
      .rule("sass")
      .test(/\.s[ac]ss|\.css/)
      .when(this.env.isHot, config => {
        config
          .use("cache")
          .loader("cache-loader")
          .end()
          .use("style")
          .loader("style-loader")
          .end();
      })
      .when(!this.env.isHot, config => {
        config.use("extract").loader(MiniCssExtractPlugin.loader);

        this.webpackChain
          .plugin("optimize-assets")
          .use(OptimizeCSSAssetsPlugin, [
            {
              cssProcessorOptions: {
                map: {
                  inline: false,
                  annotation: true
                }
              },
              canPrint: !this.env.isProduction
            }
          ])
          .end()
          .plugin("optimize-assets")
          .use(MiniCssExtractPlugin, [
            {
              filename: `css/[name]-[${this.config.hashType}].css`,
              chunkFilename: `css/[name]-[${this.config.hashType}].css`
            }
          ]);
      })
      .use("css")
      .loader("css-loader")
      .options({
        sourceMap: true,
        importLoaders: 1
      })
      .end()
      .use("postcss")
      .loader("postcss-loader")
      .options({
        sourceMap: true,
        ident: "postcss",
        plugins: [
            autoprefixer,
            ...this.useIf(this.env.isHot, [cssnano])
        ]
      })
      .end()
      .use("resolve-urls")
      .loader("resolve-url-loader")
      .options({
        sourceMap: true
      })
      .end()
      .use("sass")
      .loader("sass-loader")
      .options({
        sourceMap: true,
        implementation: require("node-sass")
      });
  }
};
