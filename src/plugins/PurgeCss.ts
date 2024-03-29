import path from "path";
import glob from "glob-all";
import Plugin from "./Plugin";
import PurgeCssPlugin from "purgecss-webpack-plugin";
import { PurgeCssConfig } from "../interfaces/plugin-config-interfaces/PurgeCssConfig";

const FILE_TYPES = ["js", "ts", "vue", "html"];

export default class PurgeCss extends Plugin<PurgeCssConfig> {
  protected options: PurgeCssConfig;
  private scanDirectories: Array<string>;

  public register() {
    this.scanDirectories = [];

    this.options.paths.forEach((directory) => {
      this.addToScannedDirectories(directory);
    });

    this.bundler.webpackChain.plugin("purge-css").use(PurgeCssPlugin, [
      {
        rejected: true,
        paths: glob.sync(this.scanDirectories, { nodir: true }),
      },
    ]);
  }

  private addToScannedDirectories(scanPath: string) {
    FILE_TYPES.forEach((type) => {
      this.scanDirectories.push(
        path.join(
          this.bundler.config.root,
          `${scanPath.replace(/\/+$/, "")}/**/*.${type}`,
        ),
      );
    });
  }
}
