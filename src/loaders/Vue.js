const Loader = require("./Loader");
const { VueLoaderPlugin } = require("vue-loader/lib/index");

module.exports = class Vue extends Loader {
  register() {
    // Vue has their own setImmediate polyfill
    this.webpackChain.node.merge({
      setImmediate: false,
    });

    this.webpackChain.module
      .noParse(/^(vue|vue-router|vuex)$/)
      .rule("vue")
      .test(/\.vue$/)
      .when(!this.env.isProduction, (config) => {
        config
          .use("cache-loader")
          .loader("cache-loader")
          .options(
            this.generateCacheConfig("vue-loader", [
              "vue-loader",
              "vue-template-compiler",
            ]),
          );
      })
      .use("vue-loader")
      .loader("vue-loader", [
        {
          whitespace: "condense",
        },
      ]);

    let alias = "vue/dist/vue.runtime.esm.js";
    if (!this.options.runtimeOnly) {
      alias = "vue/dist/vue.esm.js";
    }

    this.webpackChain.resolve.alias.set("vue$", alias);
    this.webpackChain.plugin("vue").use(VueLoaderPlugin);
  }
};
