import * as path from "path";
import loaders from "./loaders";
import { DeepPartial } from "ts-essentials";
import AbstractBundler from "./AbstractBundler";
import BundlerConfig from "./interfaces/BundlerConfig";
import { EnvironmentTypes } from "./types/EnvironmentTypes";

export default class UmdBundler extends AbstractBundler {
  constructor(
    mode: EnvironmentTypes = EnvironmentTypes.Development,
    name: string,
    entryPath: string,
    config: DeepPartial<BundlerConfig> = {},
  ) {
    super(mode, config);

    this.config.webpack.devServer.open = false;

    this.webpackChain.output.globalObject(
      `(typeof self !== 'undefined' ? self : this)`,
    );

    this.webpackChain.entry(name).add(path.join(this.config.root, entryPath));
    this.updateJavascriptLoaders();

    new loaders.Sass(this, {
      hashType: this.config.hashType,
    });

    // UMD File Settings
    this.webpackChain.output.filename("[name].umd.js");
    this.webpackChain.output.library(name);
    this.webpackChain.output.libraryTarget("umd");
    this.webpackChain.output.libraryExport("default");

    // Make sure it includes all vendors in bundle
    this.webpackChain.optimization.splitChunks({}).runtimeChunk(false);

    if (this.env.isHot) {
      this.webpackChain.devServer.set("writeToDisk", (filePath) => {
        return (
          new RegExp(`${this.config.outputPath}.*`).test(filePath) &&
          !/hot-update\.(js|json)$/.test(filePath)
        );
      });
    }

    this.config.bundleName = `${name} Bundle`;
  }
}
