const path = require("path");
const dotenv = require("dotenv");
const merge = require("webpack-merge");

const loaders = require("./loaders");
const plugins = require("./plugins");

module.exports = class VarieBundler {
  constructor(args, root, config = {}) {
    this._plugins = [];
    this._loaders = [];
    this._entries = {};
    this._customWebpackconfig = {};
    this._envConfig = dotenv.config().parsed;
    this._aliases = {
      vue$: "vue/dist/vue.esm.js"
    };

    this._env = {
      isHot: process.argv.includes("--hot"),
      isProduction: args.mode === "production",
      isAnalyzing: process.argv.includes("--analyze")
    };

    this._pluginData = {
      variables: {}
    };

    this.config = merge(
      {
        root,
        mode: args.mode,
        outputPath: path.join(root, "public"),
        appName: this._envConfig.APP_NAME || "Varie",
        host: this._envConfig.APP_HOST || "localhost",
        hashType: this._env.isHot ? "hash" : "contenthash"
      },
      config
    );

    this.variePresets();
  }

  entry(name, entryPaths) {
    this._entries[name] = [];
    entryPaths.map(entry => {
      this._entries[name].push(path.join(this.config.root, entry));
    });
    return this;
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

  customWebpackConfig(config) {
    this._customWebpackconfig = config;
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
      .addPlugin(plugins.DefineVariables)
      .when(this._env.isProduction, () => {
        this.addPlugin(plugins.HashedModules);
      })
      .when(!this._env.isHot && !this._env.isProduction, () => {
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

  build() {
    return merge(
      {
        mode: this.config.mode,
        context: this.config.root,
        optimization: require("./build/optimization")(this._env, this.config),
        devtool: this._env.isProduction
          ? "hidden-source-map"
          : "eval-source-map",
        entry: this._entries,
        output: {
          publicPath: "/",
          path: this.config.outputPath,
          filename: `js/[name].js?[${this.config.hashType}]`,
          chunkFilename: `js/[name].js?[${this.config.hashType}]`
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
        },
        stats: require("./build/stats")(this.config),
        devServer: require("./build/devServer")(this.config)
      },
      this._customWebpackconfig
    );
  }

  _buildLoaders() {
    return this._loaders.map(loader => {
      if (loader.prototype && loader.prototype.constructor.name) {
        let builtLoader = new loader(this._env, this.config);
        if (builtLoader) {
          if (builtLoader.plugin) {
            this.addPlugin(builtLoader.plugin());
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
        let builtPlugin = new plugin(this._env, this.config, this._pluginData);
        if (builtPlugin) {
          return builtPlugin.boot();
        }
      }
      return plugin;
    });
  }
};
