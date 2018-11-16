const Loader = require("./Loader");

module.exports = class Javascript extends Loader {
  register() {
    this.webpackChain.module
      .rule("js")
      .exclude.add(filepath => {
        // always transpile js in vue files
        if (/\.vue\.jsx?$/.test(filepath)) {
          return false;
        }

        // Don't transpile node_modules
        return /node_modules/.test(filepath);
      })
      .end()
      .test(/\.jsx?$/)
      .use("thread-loader")
      .loader("thread-loader")
      .end()
      .when(!this.env.isProduction, config => {
        config
          .use("cache")
          .loader("cache-loader")
          .options(
            this.generateCacheConfig(
              "js",
              ["@babel/core", "babel-loader"],
              [".babelrc", ".browserslistrc"]
            )
          );
      })
      .use("babel-loader")
      .loader("babel-loader")
      .end();
  }
};
