const Config = require("./Config");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = class Optimization extends Config {
  register() {
    this.webpackChain.optimization
      .splitChunks({
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            name: "vendor",
            chunks: "initial"
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      })
      .sideEffects(true)
      .runtimeChunk(true)
      .providedExports(true)
      .minimizer([
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true
        })
      ]);
  }
};
