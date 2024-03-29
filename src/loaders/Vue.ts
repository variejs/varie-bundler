import Loader from "./Loader";
import { VueLoaderPlugin } from "vue-loader";
import VueConfig from "../interfaces/VueConfig";

export default class Vue extends Loader<VueConfig> {
  public register() {
    this.bundler.webpackChain.module
      .noParse(/^(vue|vue-router|vuex)$/)
      .rule("vue")
      .test(/\.vue$/)
      .use("vue-loader")
      .loader("vue-loader");

    let alias = "vue/dist/vue.esm.js";
    if (this.options.runtimeOnly) {
      alias = "vue/dist/vue.runtime.esm.js";
    }

    this.bundler.webpackChain.resolve.alias.set("vue$", alias);
    this.bundler.webpackChain.plugin("vue").use(VueLoaderPlugin);
  }
}
