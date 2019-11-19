import fs from "fs";
import path from "path";
import hash from "hash-sum";
import Bundler from "../interfaces/Bundler";

export default abstract class Loader<T> {
  protected options: T;
  protected bundler: Bundler;

  constructor(bundler: Bundler, options?: T) {
    this.options = options;
    this.bundler = bundler;
    this.register();
  }

  abstract register(): void;

  public generateCacheConfig(loader, relatedPackages = [], configFiles = []) {
    relatedPackages.push("cache-loader");

    let configs = {};
    let versions = {
      "varie-bundler": require("../../package.json").version,
    };

    relatedPackages.forEach((relatedPackage) => {
      versions[
        relatedPackage
      ] = require(`${relatedPackage}/package.json`).version;
    });

    configFiles.forEach((configFile) => {
      configs[configFile] = this.getFile(configFile);
    });

    return {
      cacheIdentifier: hash({
        loader,
        configs,
        versions,
        modern: this.bundler.env.isModern,
      }),
      cacheDirectory: this.getPath(`node_modules/.cache/${loader}`),
    };
  }

  private getPath(_path) {
    return path.resolve(this.bundler.config.root, _path);
  }

  private getFile(_path) {
    let filePath = this.getPath(_path);
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, "utf-8");
    }
    return null;
  }
}
