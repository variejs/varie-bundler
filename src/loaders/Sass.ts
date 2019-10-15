import cssnano from "cssnano";
import Loader from "./Loader";
import useIf from "../helpers/useIf";
import autoprefixer from "autoprefixer";
import { HashTypes } from "../types/HashTypes";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin";

export default class Sass extends Loader<{
  hashType: HashTypes;
}> {
  public register() {
    this.varieBundler.webpackChain.module
      .rule("sass")
      .test(/\.s[ac]ss|\.css/)
      .when(this.varieBundler.config.cache, (config) => {
        config
          .use("cache-loader")
          .loader("cache-loader")
          .options(
            this.generateCacheConfig(
              "sass-loader",
              ["sass-loader", "style-loader", "postcss-loader"],
              [".browserslistrc"],
            ),
          )
          .end();
      })
      .use("style-loader")
      .options({
        singleton: true,
        hmr: this.varieBundler.env.isHot,
      })
      .loader("style-loader")
      .end()
      .when(!this.varieBundler.env.isHot, (config) => {
        config
          .use("extract")
          .loader(MiniCssExtractPlugin.loader)
          .end();

        this.varieBundler.webpackChain
          .plugin("optimize-assets")
          .use(OptimizeCSSAssetsPlugin, [
            {
              cssProcessorOptions: {
                map: {
                  inline: false,
                  annotation: true,
                },
              },
              canPrint: !this.varieBundler.env.isProduction,
            },
          ])
          .end()
          .plugin("mini-extract")
          .use(MiniCssExtractPlugin, [
            {
              filename: `css/[name]-[${this.options.hashType}].css`,
              chunkFilename: `css/[name]-[${this.options.hashType}].css`,
            },
          ]);
      })
      .use("css-loader")
      .loader("css-loader")
      .options({
        sourceMap: !this.varieBundler.env.isProduction,
        importLoaders: 4, // postcss-loader , resolve-url-loader, sass-loader, vue-loader
      })
      .end()
      .use("postcss-loader")
      .loader("postcss-loader")
      .options({
        sourceMap: true,
        ident: "postcss",
        plugins: [
          autoprefixer,
          ...useIf(!this.varieBundler.env.isHot, [cssnano]),
        ],
      })
      .end()
      .use("resolve-urls")
      .loader("resolve-url-loader")
      .options({
        sourceMap: true,
      })
      .end()
      .use("sass-loader")
      .loader("sass-loader")
      .options({
        sourceMap: true,
        implementation: require("node-sass"),
      });
  }
}
