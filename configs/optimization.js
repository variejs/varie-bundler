const UglifyPlugin = require("./../plugins/Uglify");

module.exports = function(env, config) {
  return {
    splitChunks: {
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
    },
    runtimeChunk: true,
    providedExports: true,
    minimizer: [new UglifyPlugin(env.config).boot()]
  };
};
