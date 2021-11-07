import cssnano from "cssnano";
import Loader from "./Loader";
import useIf from "../helpers/useIf";
import autoprefixer from "autoprefixer";
import { HashTypes } from "../types/HashTypes";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { Rule } from "webpack-chain";

export default class Sass extends Loader<{
  hashType: HashTypes;
}> {
  public register() {
    this.createCSSRule("css", /\.css$/);
    this.createCSSRule("sass", /\.s[ac]ss$/, "sass-loader", {
      sourceMap: true,
      implementation: require("sass"),
    });

    if (!this.bundler.env.isHot) {
      this.bundler.webpackChain
        .plugin("mini-extract")
        .use(MiniCssExtractPlugin, [
          {
            filename: `css/[name]-[${this.options.hashType}].css`,
            chunkFilename: `css/[name]-[${this.options.hashType}].css`,
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
    let baseRule = this.bundler.webpackChain.module.rule(lang).test(test);

    this.applyLoaders(
      baseRule.oneOf("vue").resourceQuery(/\?vue/),
      loader,
      loaderOptions,
    );

    this.applyLoaders(baseRule.oneOf("normal"), loader, loaderOptions);
  }

  private applyLoaders(oneOf: Rule<Rule>, loader?, loaderOptions = {}) {
    oneOf
      .when(
        !this.bundler.env.isHot,
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
        sourceMap: true,
        importLoaders: loader ? 3 : 2, // postcss-loader (1), resolve-url-loader (2), *-loader (3)
      })
      .end()
      .use("resolve-url-loader")
      .loader("resolve-url-loader")
      .options({
        sourceMap: true,
      })
      .end()
      .use("postcss-loader")
      .loader("postcss-loader")
      .options({
        postcssOptions: {
          sourceMap: true,
          ident: "postcss",
          plugins: [
            autoprefixer({ grid: true }),
            ...useIf(!this.bundler.env.isHot, [cssnano]),
          ],
        },
      })
      .end();

    if (loader) {
      oneOf.use(loader).loader(loader).options(loaderOptions);
    }
  }
}
