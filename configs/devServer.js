module.exports = function(config) {
  return {
    quiet: true,
    noInfo: true,
    overlay: true,
    compress: true,
    host: config.host,
    contentBase: config.root,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  };
};
