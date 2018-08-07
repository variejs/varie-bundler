const Loader = require("./Loader");
module.exports = class Fonts extends Loader {
  register() {
    this.webpackChain.module
      .rule("fonts")
      .test(/\.(woff|woff2|ttf|eot|svg|otf)$/)
      .use("file")
      .loader("file-loader")
      .options({
        limit: 4096,
        name: "fonts/[name].[ext]?[hash:8]"
      });
  }
};
