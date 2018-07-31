const path = require('path');
const dotenv = require('dotenv')
const merge = require('webpack-merge');

const loaders = require('./loaders');
const plugins = require('./plugins');

module.exports = class VarieBundler {

    constructor(args, root, config = {}) {
        this.args = args;
        this.envConfig = dotenv.config().parsed;
        this.config = merge({
            root,
            mode: this.args.mode,
            host: this.envConfig.APP_HOST,
            appName: this.envConfig.APP_NAME,
            isHot: process.argv.includes("--hot"),
            isProduction: this.args.mode === "production",
            outputPath: path.join(root, "public"),
            isAnalyzing: process.argv.includes("--analyze"),
            hashType: process.argv.includes("--hot") ? "hash" : "contenthash",
            aliases : {
                vue$: "vue/dist/vue.esm.js",
            }
        }, config);

        this.plugins = [];
        this.loaders = [];
        this._variables = {
            ENV : this.config.mode,
        };
        this.customWebpackconfig = {};

        Object.keys(loaders).map((type) => {
            this._addLoader(type)
        });

        Object.keys(plugins).map((type) => {
            this[type] = () => {
                return this._addPlugin(type);
            }
        });
    }

    addLoader(loader) {
        this.loaders.push(loader);
        return this;
    }

    addPlugin(plugin) {
        this.plugins.push(plugin);
        return this;
    }

    _addPlugin(type) {
        let plugin = new plugins[type](this.config);
        this.addPlugin(plugin.boot());
        return this;
    }

    _addLoader(type) {
        let loader = new loaders[type](this.config);
        this.addLoader(loader.rules());
        if(loader.plugin) {
            this.addPlugin(loader.plugin());
        }
        return this;
    }

    variables(variables) {
        this._variables = merge(this._variables, variables);
        return this;
    }

    aliases(aliases) {
        this.config.aliases = merge(this.config.aliases,  aliases);
        return this;
    }

    customWebpackConfig(config) {
        this.customWebpackconfig = config;
        return this;
    }

    build() {

        return merge({
            mode: this.config.mode,
            context: this.config.root,
            optimization: require("./build/optimization")(this.config),
            devtool: this.config.isProduction ? "hidden-source-map" : "eval-source-map",
            entry: {
                app: [
                    path.join(this.config.root, "app/app.ts"),
                    path.join(this.config.root, "resources/sass/app.scss"),
                ],
            },
            output: {
                publicPath: "/",
                path: this.config.outputPath,
                filename: `js/[name].js?[${this.config.hashType}]`,
                chunkFilename: `js/[name].js?[${this.config.hashType}]`,
            },
            module: {
                noParse: /^(vue|vue-router|vuex|varie)$/,
                rules: this.loaders,
            },
            plugins: this.plugins,
            resolve: {
                symlinks: false,
                extensions: [".js", ".jsx", ".ts", ".tsx", ".vue", ".json"],
                alias: this.config.aliases,
            },
            stats: require("./build/stats")(this.config),
            devServer: require("./build/devServer")(this.config),
        }, this.customWebpackconfig);
    }
};


// require("./build/plugins/define")({
//     ENV: this.config.mode,
// }),
// ...loadIf(!this.config.isHot, [
//     require("./build/plugins/clean")(this.config),
// ]),
// ...loadIf(!this.config.isProduction, [
//     require("./build/plugins/errors")(this.config),
// ]),
// ...loadIf(this.config.isProduction, [
//     require("./build/plugins/hashedModuleIds")(this.config),
// ]),