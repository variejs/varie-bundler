const loadIf = require("./helpers/loadIf");

module.exports = function(config) {
  return loadIf(config.isProduction, [
    require("./optimizations/uglify")(),
    require("./optimizations/cssOptimization")()
  ]);
};
