import hash from "hash-sum";
import Config from "./Config";
import TerserPlugin from "terser-webpack-plugin";

export default class Optimization<T> extends Config<undefined> {
  public register() {
    let splitChunks = {
      minSize: 0,
      chunks: "all",
      maxInitialRequests: Infinity,
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
    };

    if (this.varieBundler.config.aggressiveVendorSplitting) {
      splitChunks.cacheGroups.vendors = {
        test: /[\\/]node_modules[\\/]/,
        // @ts-ignore
        name: (module) => {
          const packageName = module.context.match(
            /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
          );
          if (packageName) {
            return this.varieBundler.env.isProduction
              ? hash(packageName[1])
              : `vendor.${packageName[1]}`;
          } else {
            return hash("unknown");
          }
        },
      };
    }

    this.varieBundler.webpackChain.optimization
      .splitChunks(splitChunks)
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
