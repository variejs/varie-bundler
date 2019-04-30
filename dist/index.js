"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
var __importStar =
  (this && this.__importStar) ||
  function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
  };
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path = __importStar(require("path"));
const util = __importStar(require("util"));
const plugins_1 = __importDefault(require("./plugins"));
const loaders_1 = __importDefault(require("./loaders"));
const configs_1 = __importDefault(require("./configs"));
const webpack_chain_1 = __importDefault(require("webpack-chain"));
const HashTypes_1 = require("./types/HashTypes");
const EnvironmentTypes_1 = require("./types/EnvironmentTypes");
class VarieBundler {
  constructor(mode = EnvironmentTypes_1.EnvironmentTypes.Development, config) {
    this.webpackChain = new webpack_chain_1.default();
    this.setupEnv(mode);
    this.setupConfig(config, process.env.PWD);
    this.presets();
  }
  aliases(aliases) {
    this.config.webpack.aliases = aliases;
    return this;
  }
  build() {
    let legacy = this.bundle().toConfig();
    if (this.argumentsHas("--inspect")) {
      legacy = this.bundle().toString();
    }
    if (this.env.isModern) {
      let modern = this.makeModernBundle();
      return this.argumentsHas("--inspect")
        ? this.inspect(legacy, modern)
        : [modern.toConfig(), legacy];
    }
    return this.argumentsHas("--inspect") ? this.inspect(legacy) : legacy;
  }
  browserSync(options = {}) {
    this.config.webpack.devServer.open = false;
    let browserSyncOptions = Object.assign(
      {},
      this.config.plugins.browserSync,
      options,
    );
    browserSyncOptions.devServer = this.config.webpack.devServer;
    new plugins_1.default.BrowserSync(this, browserSyncOptions);
    return this;
  }
  chainWebpack(callback) {
    callback(this.webpackChain, this.env);
    return this;
  }
  copy(from, to = "") {
    this.config.plugins.copy.patterns.push({
      from: from,
      to: path.join(...this.config.outputPath, to),
    });
    return this;
  }
  dontClean(exclude) {
    if (Array.isArray(exclude)) {
      this.config.plugins.clean.excludeList.push(...exclude);
    } else {
      this.config.plugins.clean.excludeList.push(exclude);
    }
    new plugins_1.default.Clean(this, this.config.plugins.clean);
    return this;
  }
  entry(name, entryPaths) {
    let webpackEntry = this.webpackChain.entry(name);
    entryPaths.map((entry) => {
      let entryPath = path.join(...this.config.root, entry);
      this.config.webpack.entryFiles.push(entryPath);
      webpackEntry.add(entryPath);
    });
    webpackEntry.end();
    this.updateJavascriptLoaders();
    return this;
  }
  plugin(Plugin, options) {
    new Plugin(this, options);
    return this;
  }
  proxy(
    from,
    to,
    options = {
      changeOrigin: true,
    },
  ) {
    this.config.webpack.devServer.proxies.push(
      Object.assign(
        {
          context: Array.isArray(from) ? from : [from],
          target: to,
        },
        options,
      ),
    );
    return this;
  }
  varieConfig(variables) {
    this.config.plugins.defineEnvironmentVariables.variables = variables;
    return this;
  }
  webWorkers() {
    new loaders_1.default.WebWorkers(this);
    return this;
  }
  argumentsHas(argument) {
    let commandLineArguments = process.argv;
    return commandLineArguments
      ? commandLineArguments.includes(argument)
      : false;
  }
  bundle() {
    this.webpackChain.when(!this.env.isProduction, () => {
      new plugins_1.default.WebpackBar(this, {
        name: this.config.bundleName || "Client",
      });
    });
    this.webpackChain.when(this.env.isHot, () => {
      new configs_1.default.DevServer(this, this.config.webpack.devServer);
    });
    new configs_1.default.Aliases(this, this.config.webpack.aliases);
    new plugins_1.default.DefineEnvironmentVariables(
      this,
      this.config.plugins.defineEnvironmentVariables,
    );
    if (this.config.plugins.copy.patterns.length > 0) {
      new plugins_1.default.Copy(this, this.config.plugins.copy.patterns);
    }
    return this.webpackChain;
  }
  inspect(...bundles) {
    bundles.forEach((bundle) => {
      util.inspect(console.log(bundle.toString()), false, null, true);
    });
    process.exit(0);
  }
  setupConfig(config, root) {
    let envConfig = dotenv_1.default.config().parsed;
    let outputPath = path.join(root, "public");
    let host = envConfig.APP_HOST || "localhost";
    this.config = Object.assign(
      {
        root,
        host,
        outputPath,
        appName: envConfig.APP_NAME || "Varie",
        hashType: this.env.isHot
          ? HashTypes_1.HashTypes.Hash
          : HashTypes_1.HashTypes.ContentHash,
        plugins: {
          aliases: {},
          copy: {
            patterns: [],
          },
          browserSync: {
            host,
            outputPath,
            port: 3000,
            proxy: "localhost:8080",
          },
          clean: {
            excludeList: [],
          },
          defineEnvironmentVariables: {
            variables: [],
          },
        },
        webpack: {
          aliases: [],
          entryFiles: [],
          devServer: {
            host,
            open: true,
            proxies: [],
          },
        },
        vue: {
          runtimeOnly: true,
        },
      },
      config,
    );
  }
  setupEnv(mode) {
    this.env = {
      mode,
      isHot: this.argumentsHas("--hot"),
      isModern: this.argumentsHas("--modern"),
      isAnalyzing: this.argumentsHas("--analyze"),
      isProduction: mode === EnvironmentTypes_1.EnvironmentTypes.Production,
      isDevelopment: mode === EnvironmentTypes_1.EnvironmentTypes.Development,
    };
  }
  presets() {
    new loaders_1.default.Html(this);
    this.updateJavascriptLoaders();
    new loaders_1.default.Vue(this, this.config.vue);
    new loaders_1.default.Sass(this, {
      hashType: this.config.hashType,
    });
    new loaders_1.default.Fonts(this);
    new loaders_1.default.Images(this);
    new plugins_1.default.NamedChunks(this);
    new plugins_1.default.CaseSensitivePaths(this);
    new plugins_1.default.Clean(this, this.config.plugins.clean);
    this.webpackChain
      .when(!this.env.isProduction, () => {
        new plugins_1.default.Errors(this);
      })
      .when(this.env.isProduction, () => {
        new plugins_1.default.HashedModules(this);
      })
      .when(this.env.isAnalyzing, () => {
        new plugins_1.default.BundleAnalyzer(this);
      });
    this.webpackChain
      .mode(this.env.mode)
      .context(this.config.root)
      .devtool(this.env.isProduction ? "hidden-source-map" : "eval-source-map")
      .resolve.symlinks(false);
    new configs_1.default.Stats(this);
    new configs_1.default.Output(this);
    new configs_1.default.Extensions(this);
    new configs_1.default.Optimization(this);
  }
  makeModernBundle() {
    this.config.bundleName = "ES Modules";
    let modern = this.bundle();
    new plugins_1.default.Preload(this);
    this.updateJavascriptLoaders();
    if (this.env.isAnalyzing) {
      modern.plugin("analyzer").tap(() => {
        return [
          {
            analyzerPort: 8889,
          },
        ];
      });
    }
    modern.output
      .filename(`js/[name]-[${this.config.hashType}].js`)
      .chunkFilename(`js/[name]-[${this.config.hashType}].js`);
    modern.plugins.delete("clean");
    return modern;
  }
  updateJavascriptLoaders(modernBuild = false) {
    new loaders_1.default.Javascript(this, {
      modernBuild,
      entryFiles: this.config.webpack.entryFiles,
    });
    new loaders_1.default.Typescript(this, {
      modernBuild,
      entryFiles: this.config.webpack.entryFiles,
    });
  }
}
exports.default = VarieBundler;
//# sourceMappingURL=index.js.map
