const fs = require("fs");
const path = require("path");
const hash = require("hash-sum");
const useIf = require("./../helpers/useIf");

module.exports = class Loader {
  constructor(varieLoader) {
    this.useIf = useIf;
    this.varieLoader = varieLoader;
    this.env = this.varieLoader._env;
    this.config = this.varieLoader._config;
    this.webpackChain = this.varieLoader._webpackChain;
    this.register();
  }

  generateCacheConfig(loader, relatedPackages = [], configFiles = []) {
    relatedPackages.push("cache-loader");

    let configs = {};
    let versions = {
      "varie-bundler": require("./../package.json").version
    };

    relatedPackages.forEach(relatedPackage => {
      versions[
        relatedPackage
      ] = require(`${relatedPackage}/package.json`).version;
    });

    configFiles.forEach(configFile => {
      configs[configFile] = this._getFile(configFile);
    });

    return {
      cacheIdentifier: hash({
        loader,
        configs,
        versions,
        modern: this.env.isModern
      }),
      cacheDirectory: this._getPath(`node_modules/.cache/${loader}`)
    };
  }

  _getPath(_path) {
    return path.resolve(this.config.root, _path);
  }
  _getFile(_path) {
    let filePath = this._getPath(_path);
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, "utf-8");
    }
    return null;
  }
};
