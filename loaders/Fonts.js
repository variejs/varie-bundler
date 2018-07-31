const Loader = require("./Loader");
module.exports = class Fonts extends Loader {
  rules() {
    return {
      test: /\.(woff|woff2|ttf|eot|svg|otf)$/,
      loader: "file-loader",
      options: {
        limit: 4096,
        name: "fonts/[name].[ext]?[hash:8]"
      }
    };
  }
};
