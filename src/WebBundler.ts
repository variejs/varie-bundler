import * as path from "path";
import loaders from "./loaders";
import plugins from "./plugins";
import { DeepPartial } from "ts-essentials";
import AbstractBundler from "./AbstractBundler";
import BundlerConfig from "./interfaces/BundlerConfig";
import { EnvironmentTypes } from "./types/EnvironmentTypes";

export default class WebBundler extends AbstractBundler {
  constructor(
    mode: EnvironmentTypes = EnvironmentTypes.Development,
    config: DeepPartial<BundlerConfig> = {},
  ) {
    super(mode, config);

    new loaders.Vue(this, this.config.vue);

    new loaders.Sass(this, {
      hashType: this.config.hashType,
    });

    new loaders.Fonts(this);
    new loaders.Images(this);

    new plugins.Html(this, this.config.plugins.html);
    new plugins.Clean(this, this.config.plugins.clean);
  }

  public entry(name: string, entryPaths: Array<string>): this {
    let webpackEntry = this.webpackChain.entry(name);

    entryPaths.map((entry) => {
      let entryPath = path.join(this.config.root, entry);
      this.config.webpack.entryFiles.push(entryPath);
      webpackEntry.add(entryPath);
    });

    webpackEntry.end();

    this.updateJavascriptLoaders();

    return this;
  }
}
