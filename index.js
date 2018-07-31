const path = require("path");
const dotenv = require("dotenv");
const merge = require("webpack-merge");

const loaders = require("./loaders");
const plugins = require("./plugins");

module.exports = class VarieBundler {
  constructor(args, root, config = {}) {
    this.plugins = [];
    this.loaders = [];
    this.customWebpackconfig = {};
    this.envConfig = dotenv.config().parsed;
    this.config = merge(
      {
        root,
        entries: {},
        variables: {},
        mode: args.mode,
        host: this.envConfig.APP_HOST,
        appName: this.envConfig.APP_NAME,
        outputPath: path.join(root, "public"),
        isHot: process.argv.includes("--hot"),
        isProduction: args.mode === "production",
        isAnalyzing: process.argv.includes("--analyze"),
        hashType: process.argv.includes("--hot") ? "hash" : "contenthash",
        aliases: {
          vue$: "vue/dist/vue.esm.js"
        }
      },
      config
    );

    this.variePresets();
  }

  entry(name, entryPaths) {
    entryPaths.map(entry => {
      this.config.entries[name] = path.join(this.config.root, entry);
    });
    return this;
  }

  addLoader(loader) {
    if (loader) {
      this.loaders.push(loader);
    }
    return this;
  }

  addPlugin(plugin) {
    if (plugin) {
      this.plugins.push(plugin);
    }
    return this;
  }

  aliases(aliases) {
    this.config.aliases = merge(this.config.aliases, aliases);
    return this;
  }

  customWebpackConfig(config) {
    this.customWebpackconfig = config;
    return this;
  }

  variables(variables) {
    this.config.variables = merge(this.config.variables, variables);
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
      .when(this.config.isProduction, () => {
        this.addPlugin(plugins.HashedModules);
      })
      .when(!this.config.isHot && !this.config.isProduction, () => {
        this.addPlugin(plugins.Clean);
      })
      .when(!this.config.isProduction, () => {
        this.addPlugin(plugins.BrowserSync);
      })
      .when(this.config.isAnalyzing, () => {
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
        optimization: require("./build/optimization")(this.config),
        devtool: this.config.isProduction
          ? "hidden-source-map"
          : "eval-source-map",
        entry: this.config.entries,
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
          alias: this.config.aliases
        },
        stats: require("./build/stats")(this.config),
        devServer: require("./build/devServer")(this.config)
      },
      this.customWebpackconfig
    );
  }

  _buildLoaders() {
    return this.loaders.map(loader => {
      if (loader.prototype && loader.prototype.constructor.name) {
        let builtLoader = new loader(this.config);
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
    return this.plugins.map(plugin => {
      if (plugin.prototype && plugin.prototype.constructor.name) {
        let builtPlugin = new plugin(this.config);
        if (builtPlugin) {
          return builtPlugin.boot();
        }
      }
      return plugin;
    });
  }
};
