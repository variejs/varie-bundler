import Loader from "./Loader";
import { VueLoaderPlugin } from "vue-loader";
import VueConfig from "../interfaces/VueConfig";

export default class Vue extends Loader<VueConfig> {
  public register() {
    // Vue has their own setImmediate polyfill
    this.varieBundler.webpackChain.node.merge({
      setImmediate: false,
    });

    this.varieBundler.webpackChain.module
      .noParse(/^(vue|vue-router|vuex)$/)
      .rule("vue")
      .test(/\.vue$/)
      .when(!this.varieBundler.env.isProduction, (config) => {
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
      .loader("vue-loader")
      .options({
        whitespace: "condense",
      });

    let alias = "vue/dist/vue.runtime.esm.js";
    if (!this.options.runtimeOnly) {
      alias = "vue/dist/vue.esm.js";
    }

    this.varieBundler.webpackChain.resolve.alias.set("vue$", alias);
    this.varieBundler.webpackChain.plugin("vue").use(VueLoaderPlugin);
  }
}
