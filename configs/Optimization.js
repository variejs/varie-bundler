const Config = require("./Config");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = class Optimization extends Config {
  register() {
    this.webpackChain.optimization
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
      .noEmitOnErrors(this.env.isProduction)
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
};
