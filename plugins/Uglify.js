const Plugin = require("./Plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = class Uglify extends Plugin {
  boot() {
    return new UglifyJsPlugin({
      cache: true,
      parallel: true,
      sourceMap: true
    });
  }
};
