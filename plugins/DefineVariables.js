const webpack = require("webpack");
const merge = require("webpack-merge");

module.exports = class DefineVariables {
  constructor(config) {
    this.config = config;
  }

  boot() {
    return new webpack.DefinePlugin(
      merge(
        {
          ENV: this.config.mode
        },
        this.config.variables
      )
    );
  }
};
