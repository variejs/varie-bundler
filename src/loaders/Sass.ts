import cssnano from "cssnano";
import Loader from "./Loader";
import useIf from "../helpers/useIf";
import { OneOf } from "webpack-chain";
import autoprefixer from "autoprefixer";
import { HashTypes } from "../types/HashTypes";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin";

export default class Sass extends Loader<{
  hashType: HashTypes;
}> {
  public register() {
    this.createCSSRule("css", /\.css$/);
    this.createCSSRule("sass", /\.s[ac]ss$/, "sass-loader", {
      sourceMap: true,
      implementation: require("node-sass"),
    });

    if (!this.varieBundler.env.isHot) {
      this.varieBundler.webpackChain
        .plugin("mini-extract")
        .use(MiniCssExtractPlugin, [
          {
            filename: `css/[name]-[${this.options.hashType}].css`,
            chunkFilename: `css/[name]-[${this.options.hashType}].css`,
          },
        ]);
    }
    if (this.varieBundler.env.isProduction) {
      this.varieBundler.webpackChain
        .plugin("optimize-assets")
        .use(OptimizeCSSAssetsPlugin, [
          {
            canPrint: false,
            cssProcessorOptions: {
              map: {
                inline: false,
                annotation: true,
              },
            },
          },
        ]);
    }
  }

  private createCSSRule(
    lang: string,
    test: RegExp,
    loader?,
    loaderOptions = {},
  ) {
    let baseRule = this.varieBundler.webpackChain.module.rule(lang).test(test);

    this.applyLoaders(
      `${lang}-vue`,
      baseRule.oneOf("vue").resourceQuery(/\?vue/),
      loader,
      loaderOptions,
    );

    this.applyLoaders(
      `${lang}-normal`,
      baseRule.oneOf("normal"),
      loader,
      loaderOptions,
    );
  }

  private applyLoaders(
    lang: string,
    oneOf: OneOf,
    loader?,
    loaderOptions = {},
  ) {
    oneOf
      .when(this.varieBundler.config.cache, (config) => {
        config
          .use("cache-loader")
          .loader("cache-loader")
          .options(
            this.generateCacheConfig(
              `${lang}-css-cache`,
              ["sass-loader", "vue-loader", "postcss-loader"],
              [".browserslistrc"],
            ),
          )
          .end();
      })
      .when(
        !this.varieBundler.env.isHot,
        (config) => {
          config
            .use("mini-extract-loader")
            .loader(MiniCssExtractPlugin.loader)
            .end();
        },
        (config) => {
          config
            .use("vue-style-loader")
            .loader("vue-style-loader")
            .options({
              sourceMap: true,
            })
            .end();
        },
      )
      .use("css-loader")
      .loader("css-loader")
      .options({
        sourceMap: !this.varieBundler.env.isProduction,
        importLoaders: loader ? 3 : 2, // postcss-loader (1), resolve-url-loader (2), *-loader (3)
      })
      .end()
      .use("postcss-loader")
      .loader("postcss-loader")
      .options({
        sourceMap: true,
        ident: "postcss",
        plugins: [
          autoprefixer({ grid: true }),
          ...useIf(!this.varieBundler.env.isHot, [cssnano]),
        ],
      })
      .end()
      .use("resolve-url-loader")
      .loader("resolve-url-loader")
      .options({
        sourceMap: true,
      })
      .end();

    if (loader) {
      oneOf
        .use(loader)
        .loader(loader)
        .options(loaderOptions);
    }
  }
}
