import fs from "fs";
import dotenv from "dotenv";
import * as path from "path";
import webpack from "webpack";
import plugins from "./plugins";
import loaders from "./loaders";
import webpackConfigs from "./configs";
import WebpackChain from "webpack-chain";
import { HashTypes } from "./types/HashTypes";
import { EnvironmentTypes } from "./types/EnvironmentTypes";
import VarieBundlerConfig from "./interfaces/VarieBundlerConfig";
import VarieBundlerEnvironment from "./interfaces/VarieBundlerEnvironment";
import { BrowserSyncPluginConfig } from "./interfaces/plugin-config-interfaces/BrowserSyncPluginConfig";

export default class VarieBundler {
  public config: VarieBundlerConfig;
  public env: VarieBundlerEnvironment;
  public webpackChain = new WebpackChain();
  public bundles: Array<webpack.Configuration> = [];

  constructor(
    mode: EnvironmentTypes = EnvironmentTypes.Development,
    config?: VarieBundlerConfig,
  ) {
    this.setupEnv(mode);
    this.setupConfig(config, process.cwd());
    this.presets();
  }

  public aliases(aliases: Array<string>): this {
    this.config.webpack.aliases = aliases;
    return this;
  }

  aggressiveVendorSplitting() {
    this.config.aggressiveVendorSplitting = true;
    new webpackConfigs.Optimization(this);
    return this;
  }

  public build(): Array<webpack.Configuration> {
    this.addBundle(this.bundle());
    if (this.env.isModern) {
      this.addBundle(this.makeModernBundle());
    }
    if (this.env.isInspecting) {
      process.exit();
    }
    return this.bundles;
  }

  public browserSync(options?: BrowserSyncPluginConfig): this {
    this.config.webpack.devServer.open = false;

    let browserSyncOptions = Object.assign(
      {},
      this.config.plugins.browserSync,
      options || {},
    );

    new plugins.BrowserSync(this, browserSyncOptions);
    return this;
  }

  public chainWebpack(
    callback: (webpackChain: WebpackChain, env: VarieBundlerEnvironment) => any,
  ): this {
    callback(this.webpackChain, this.env);
    return this;
  }

  public copy(from: string, to: string = ""): this {
    this.config.plugins.copy.patterns.push({
      from: path.join(this.config.root, from),
      to: path.join(this.config.outputPath, to),
    });
    return this;
  }

  public dontClean(exclude: Array<string> | string): this {
    if (!Array.isArray(exclude)) {
      exclude = [exclude];
    }

    exclude.forEach((pattern) => {
      this.config.plugins.clean.excludeList.push(pattern);
    });

    new plugins.Clean(this, this.config.plugins.clean);

    return this;
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

  public eslint() {
    new loaders.Eslint(this);
    return this;
  }


  public plugin<T>(
    Plugin: { new (VarieBundler: VarieBundler, options: object): T },
    options: object,
  ): this {
    new Plugin(this, options);
    return this;
  }

  public proxy(
    from: string,
    to: string,
    options = {
      changeOrigin: true,
    },
  ): this {
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

  public purgeCss(
    paths: Array<string>,
    config: {
      whitelistSelectors: Array<string>;
      whiteListPatterns: Array<RegExp>;
      whitelistPatternsChildren: Array<RegExp>;
    },
  ): this {
    this.config.plugins.purgeCss = Object.assign({}, { paths }, config);
    new plugins.PurgeCss(this, this.config.plugins.purgeCss);
    return this;
  }

  public globalSassIncludes(filePaths, rx: RegExp = /\.vue$/) {
    if (!Array.isArray(filePaths)) {
      filePaths = [filePaths];
    }
    this.config.loaders.sassLoader.globalIncludes = this.config.loaders.sassLoader.globalIncludes.concat(
      filePaths,
    );
    this.webpackChain.module
      .rule("sass")
      .oneOf("vue")
      .use("sass-loader")
      .tap((options) => {
        options.prependData = (loaderContext) => {
          console.info(loaderContext.resourcePath, '')
          if (rx.test(loaderContext.resourcePath)) {

            return this.config.loaders.sassLoader.globalIncludes
              .map((_filePath) => {
                return `@import "${path
                  .join(this.config.root, _filePath)
                  .replace(/\\/g, "/")}";`;
              })
              .join("\n");
          }
          return "";
        };
        return options;
      });
    return this;
  }

  public varieConfig(variables: Array<any>): this {
    this.config.plugins.defineEnvironmentVariables.variables = variables;
    return this;
  }

  public webWorkers(): this {
    new loaders.WebWorkers(this);
    return this;
  }

  private addBundle(bundle: WebpackChain) {
    if (this.env.isInspecting) {
      this.inspect(bundle);
    }
    this.bundles.push(bundle.toConfig());
  }

  private argumentsHas(argument: string): boolean {
    let commandLineArguments = process.argv;
    return commandLineArguments
      ? commandLineArguments.includes(argument)
      : false;
  }

  private bundle(): WebpackChain {
    this.webpackChain.when(!this.env.isProduction, () => {
      new plugins.WebpackBar(this, {
        name: this.config.bundleName,
      });
    });

    new webpackConfigs.Aliases(this, this.config.webpack.aliases);

    new plugins.DefineEnvironmentVariables(
      this,
      this.config.plugins.defineEnvironmentVariables,
    );

    if (!this.config.modern) {
      if (this.config.plugins.copy.patterns.length > 0) {
        new plugins.Copy(this, this.config.plugins.copy);
      }

      this.webpackChain.when(this.env.isHot, () => {
        new webpackConfigs.DevServer(this, this.config.webpack.devServer);
      });
    }

    return this.webpackChain;
  }

  private inspect(bundle: WebpackChain): void {
    let logName = `${this.config.bundleName}-bundle-webpack-output.json`;
    fs.writeFileSync(logName, bundle.toString());
    console.log(`\n Wrote : ${this.config.bundleName} Bundle to ${logName}\n`);
  }

  private setupConfig(config: VarieBundlerConfig, root: string): void {
    let envConfig = dotenv.config().parsed;
    let host = envConfig.APP_HOST || "0.0.0.0";
    let outputPath = path.join(root, envConfig.OUTPUT_PATH || "public");

    this.config = Object.assign(
      {
        root,
        host,
        outputPath,
        bundleName: "Client",
        aggressiveVendorSplitting: false,
        appName: envConfig.APP_NAME || "Varie",
        hashType: this.env.isHot ? HashTypes.Hash : HashTypes.ContentHash,
        cache: this.env.isHot && !this.argumentsHas("--disable-cache"),
        plugins: {
          aliases: {},
          copy: {
            patterns: [],
          },
          browserSync: {
            host,
            outputPath,
            port: 3000,
            proxy: `${host}:8080`,
          },
          clean: {
            excludeList: [],
          },
          defineEnvironmentVariables: {
            variables: [],
          },
        },
        loaders: {
          sassLoader: {
            globalIncludes: [],
          },
        },
        webpack: {
          aliases: [],
          entryFiles: [],
          devServer: {
            host,
            open: true,
            proxies: [],
            port: 8080,
          },
        },
        vue: {
          runtimeOnly: true,
        },
      },
      config,
    );
  }

  private setupEnv(mode: EnvironmentTypes): void {
    this.env = {
      mode,
      isHot: this.argumentsHas("--hot"),
      isModern: this.argumentsHas("--modern"),
      isAnalyzing: this.argumentsHas("--analyze"),
      isInspecting: this.argumentsHas("--inspect"),
      isProduction: mode === EnvironmentTypes.Production,
      isDevelopment: mode === EnvironmentTypes.Development,
    };
  }

  private presets(): void {
    new loaders.Html(this);
    this.updateJavascriptLoaders();
    new loaders.Vue(this, this.config.vue);
    new loaders.Sass(this, {
      hashType: this.config.hashType,
    });
    new loaders.Fonts(this);
    new loaders.Images(this);

    new plugins.NamedChunks(this);
    new plugins.CaseSensitivePaths(this);
    new plugins.Clean(this, this.config.plugins.clean);

    this.webpackChain
      .when(!this.env.isProduction, () => {
        new plugins.Errors(this);
      })
      .when(this.env.isProduction, () => {
        new plugins.HashedModules(this);
      })
      .when(this.env.isAnalyzing, () => {
        new plugins.BundleAnalyzer(this);
      });

    this.webpackChain
      .mode(this.env.mode)
      .context(this.config.root)
      .devtool(this.env.isProduction ? "hidden-source-map" : "eval-source-map")
      .resolve.symlinks(false);

    new webpackConfigs.Stats(this);
    new webpackConfigs.Output(this);
    new webpackConfigs.Extensions(this);
    new webpackConfigs.Optimization(this);
  }

  private makeModernBundle(): WebpackChain {
    this.config.bundleName = `${this.config.bundleName} - Modern`;

    this.config.modern = true;
    let modern = this.bundle();

    new plugins.Preload(this);

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

    return modern;
  }

  private updateJavascriptLoaders(modernBuild: boolean = false): void {
    new loaders.Javascript(this, {
      modernBuild,
      entryFiles: this.config.webpack.entryFiles,
    });
    new loaders.Typescript(this, {
      modernBuild,
      entryFiles: this.config.webpack.entryFiles,
    });
  }
}

module.exports = exports["default"];
