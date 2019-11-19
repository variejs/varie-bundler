import webpack from "webpack";
import WebpackChain from "webpack-chain";
import BundlerConfig from "./BundlerConfig";
import BundlerEnvironment from "./BundlerEnvironment";

export default interface Bundler {
  config: BundlerConfig;
  env: BundlerEnvironment;
  webpackChain: WebpackChain;
  bundles: Array<webpack.Configuration>;

  build(): Array<webpack.Configuration>;
  chainWebpack(
    callback: (webpackChain: WebpackChain, env: BundlerEnvironment) => any,
  ): this;

  plugin<T>(
    Plugin: { new (Bundler: Bundler, options: object): T },
    options: object,
  ): this;
}
