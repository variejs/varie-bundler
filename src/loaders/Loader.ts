import fs from "fs";
import path from "path";
import hash from "hash-sum";
import VarieBundler from "../index";

export default abstract class Loader<T> {
  protected options: T;
  protected varieBundler: VarieBundler;

  constructor(varieBundler: VarieBundler, options?: T) {
    this.options = options;
    this.varieBundler = varieBundler;
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
        modern: this.varieBundler.env.isModern,
      }),
      cacheDirectory: this.getPath(`node_modules/.cache/${loader}`),
    };
  }

  private getPath(_path) {
    return path.resolve(this.varieBundler.config.root, _path);
  }

  private getFile(_path) {
    let filePath = this.getPath(_path);
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, "utf-8");
    }
    return null;
  }
}
