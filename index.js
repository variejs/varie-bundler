const path = require("path");
const dotenv = require("dotenv");
const loaders = require("./loaders");
const plugins = require("./plugins");
const merge = require("webpack-merge");
const webpackConfigs = require("./configs");
const WebpackChain = require("webpack-chain");

module.exports = class VarieBundler {
  constructor(args, root, config = {}) {
    this._aliases = {};
    this._webpackChain = new WebpackChain();

    this._setupEnv(args ? args.mode : "development");
    this._setupConfig(root, config);
    this._variePresets();
  }

  aliases(aliases) {
    this._aliases = merge(this._aliases, aliases);
    return this;
  }

  build() {
    return this._argumentsHas("--inspect")
      ? this._inspect()
      : this._bundle().toConfig();
  }

  chainWebpack(callback) {
    callback(this._webpackChain, this._env);
    return this;
  }

  entry(name, entryPaths) {
    let webpackEntry = this._webpackChain.entry(name);

    entryPaths.map(entry => {
      webpackEntry.add(path.join(this._config.root, entry));
    });

    webpackEntry.end();

    return this;
  }

  environmentVariables(variables) {
    this._config.environmentVariables = variables;
    return this;
  }

  _argumentsHas(argument) {
    let commandLineArguments = process.argv;
    return commandLineArguments
      ? commandLineArguments.includes(argument)
      : false;
  }

  _bundle() {
    new webpackConfigs.Aliases(this);
    new plugins.DefineEnvironmentVariables(this);
    return this._webpackChain;
  }

  _inspect() {
    console.log(this._bundle().toString());
    process.exit(0);
  }

  _setupConfig(root, config) {
    let envConfig = dotenv.config().parsed;
    this._config = merge(
      {
        root,
        outputPath: path.join(root, "public"),
        appName: envConfig.APP_NAME || "Varie",
        host: envConfig.APP_HOST || "localhost",
        hashType: this._env.isHot ? "hash" : "contenthash"
      },
      config
    );
  }

  _setupEnv(mode = "development") {
    this._env = {
      mode,
      isHot: this._argumentsHas("--hot"),
      isProduction: mode === "production",
      isDevelopment: mode === "development",
      isAnalyzing: this._argumentsHas("--analyze")
    };
  }

  _variePresets() {
    new loaders.Html(this);
    new loaders.Typescript(this);
    new loaders.Vue(this);
    new loaders.Sass(this);
    new loaders.Fonts(this);
    new loaders.Images(this);

    new plugins.Clean(this);

    this._webpackChain
      .when(!this._env.isProduction, () => {
        new plugins.Errors(this);
        new plugins.BrowserSync(this);
      })
      .when(this._env.isProduction, () => {
        new plugins.HashedModules(this);
      })
      .when(this._env.isAnalyzing, () => {
        new plugins.BundleAnalyzer(this);
      });

    this._webpackChain
      .mode(this._env.mode)
      .context(this._config.root)
      .devtool(this._env.isProduction ? "hidden-source-map" : "eval-source-map")
      .resolve.symlinks(false);

    new webpackConfigs.Stats(this);
    new webpackConfigs.Output(this);
    new webpackConfigs.DevServer(this);
    new webpackConfigs.Extensions(this);
    new webpackConfigs.Optimization(this);
  }
};
