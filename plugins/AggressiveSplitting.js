const Plugin = require("./Plugin");
const webpack = require("webpack");

module.exports = class AggressiveSplitting extends Plugin {
  register() {
    this.webpackChain
      .plugin("agressive-splitting")
      .use(webpack.optimize.AggressiveSplittingPlugin, [
        {
          minSize: this.options.minSize,
          maxSize: this.options.maxSize,
        },
      ]);
  }
};
