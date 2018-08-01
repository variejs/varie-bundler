const loadIf = require("./../helpers/loadIf");

module.exports = function(env, config) {
  return loadIf(env.isProduction, [
    require("./optimizations/uglify")(),
    require("./optimizations/cssOptimization")()
  ]);
};
