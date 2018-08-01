const path = require("path");
const dotenv = require("dotenv");
const loaders = require("./loaders");
const plugins = require("./plugins");
const merge = require("webpack-merge");
const webpackConfigs = require("./configs");

module.exports = class VarieBundler {
  constructor(args, root, config = {}) {
    this._plugins = [];
    this._loaders = [];
    this._entries = {};
    this._customWebpackconfig = {};
    this._envConfig = dotenv.config().parsed;
    this._mode = args ? args.mode : "development";
    this._aliases = {
      vue$: "vue/dist/vue.esm.js"
    };

    this._env = {
      mode: this._mode,
      isHot: this._argumentsHas("--hot"),
      isProduction: this._mode === "production",
      isDevelopment: this._mode === "development",
      isAnalyzing: this._argumentsHas("--analyze")
    };

    this._pluginData = {
      variables: {}
    };

    this._config = merge(
      {
        root,
        outputPath: path.join(root, "public"),
        appName: this._envConfig.APP_NAME || "Varie",
        host: this._envConfig.APP_HOST || "localhost",
        hashType: this._env.isHot ? "hash" : "contenthash"
      },
      config
    );

    this.variePresets();
  }

  addLoader(loader) {
    if (loader) {
      this._loaders.push(loader);
    }
    return this;
  }

  addPlugin(plugin) {
    if (plugin) {
      this._plugins.push(plugin);
    }
    return this;
  }

  aliases(aliases) {
    this._aliases = merge(this._aliases, aliases);
    return this;
  }

  build() {
    return merge(
      {
        entry: this._entries,
        mode: this._env.mode,
        context: this._config.root,
        stats: webpackConfigs.stats(this._config),
        devServer: webpackConfigs.devServer(this._config),
        optimization: webpackConfigs.optimization(this._env, this._config),
        devtool: this._env.isProduction
          ? "hidden-source-map"
          : "eval-source-map",
        output: {
          publicPath: "/",
          path: this._config.outputPath,
          filename: `js/[name]-[${this._config.hashType}].js`,
          chunkFilename: `js/[name]-[${this._config.hashType}].js`
        },
        module: {
          noParse: /^(vue|vue-router|vuex|varie)$/,
          rules: this._buildLoaders()
        },
        plugins: this._buildPlugins(),
        resolve: {
          symlinks: false,
          extensions: [".js", ".jsx", ".ts", ".tsx", ".vue", ".json"],
          alias: this._aliases
        }
      },
      this._customWebpackconfig
    );
  }

  entry(name, entryPaths) {
    this._entries[name] = [];
    entryPaths.map(entry => {
      this._entries[name].push(path.join(this._config.root, entry));
    });
    return this;
  }

  variables(variables) {
    this._pluginData.variables = merge(this._pluginData.variables, variables);
    return this;
  }

  variePresets() {
    this.addLoader(loaders.Html)
      .addLoader(loaders.Typescript)
      .addLoader(loaders.Vue)
      .addLoader(loaders.Sass)
      .addLoader(loaders.Fonts)
      .addLoader(loaders.Images)
      // .addPlugin(plugins.DefineVariables)
      .when(this._env.isProduction, () => {
        this.addPlugin(plugins.HashedModules);
      })
      .when(!this._env.isHot, () => {
        this.addPlugin(plugins.Clean);
      })
      .when(!this._env.isProduction, () => {
        this.addPlugin(plugins.BrowserSync);
      })
      .when(this._env.isAnalyzing, () => {
        this.addPlugin(plugins.BundleAnalyzer);
      });
  }

  when(conditional, callback) {
    if (conditional) {
      callback();
    }
    return this;
  }

  webpackConfig(config) {
    this._customWebpackconfig = config;
    return this;
  }

  _argumentsHas(argument) {
    let commandLineArguments = process.argv;
    return commandLineArguments
      ? commandLineArguments.includes(argument)
      : false;
  }

  _buildLoaders() {
    return this._loaders.map(loader => {
      if (loader.prototype && loader.prototype.constructor.name) {
        let builtLoader = new loader(this._env, this._config);
        if (builtLoader) {
          if (builtLoader.plugins) {
            let plugins = builtLoader.plugins();
            if (Array.isArray(plugins)) {
              plugins.map(plugin => {
                this.addPlugin(plugin);
              });
            }
          }
          return builtLoader.rules();
        }
      }
      return loader;
    });
  }

  _buildPlugins() {
    return this._plugins.map(plugin => {
      if (plugin.prototype && plugin.prototype.constructor.name) {
        let builtPlugin = new plugin(this._env, this._config, this._pluginData);
        if (builtPlugin) {
          return builtPlugin.boot();
        }
      }
      return plugin;
    });
  }
};
