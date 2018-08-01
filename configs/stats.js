module.exports = function(config) {
  return {
    hash: false,
    chunks: false,
    modules: false,
    source: false,
    reasons: false,
    version: false,
    timings: true,
    children: false,
    publicPath: false,
    errorDetails: false
  };
};
