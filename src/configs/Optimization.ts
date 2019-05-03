import Config from "./Config";
import TerserPlugin from "terser-webpack-plugin";

export default class Optimization<T> extends Config<undefined> {
  public register() {
    this.varieBundler.webpackChain.optimization
      .splitChunks({
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            name: "vendor",
            chunks: "initial",
          },
          default: {
            minChunks: 2,
            priority: -20,
            chunks: "initial",
            reuseExistingChunk: true,
          },
        },
      })
      .runtimeChunk(true)
      .noEmitOnErrors(this.varieBundler.env.isProduction)
      .minimizer("minify")
      .use(TerserPlugin, [
        {
          cache: true,
          parallel: true,
          sourceMap: true,
          terserOptions: {
            mangle: true,
            safari10: true,
            keep_fnames: true,
            output: {
              comments: false,
            },
          },
        },
      ]);
  }
}
