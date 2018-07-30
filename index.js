const path = require("path");
const loadIf = require("./build/helpers/loadIf");
const envConfig = require("dotenv").config().parsed;

module.exports = (env, argv) => {

  const root = `${__dirname}/../../`;

  console.info(argv);

  const config = {
    mode: argv.mode,
    host: envConfig.APP_HOST,
    appName: envConfig.APP_NAME,
    root: path.resolve(root),
    isHot: process.argv.includes("--hot"),
    isProduction: argv.mode === "production",
    outputPath: path.join(root, "public"),
    isAnalyzing: process.argv.includes("--analyze"),
    hashType: process.argv.includes("--hot") ? "hash" : "contenthash",
  };

  return {
    mode: config.mode,
    context: config.root,
    optimization: require("./build/optimization")(config),
    devtool: config.isProduction ? "hidden-source-map" : "eval-source-map",
    entry: {
      app: [
        path.join(config.root, "app/app.ts"),
        path.join(config.root, "resources/sass/app.scss"),
      ],
    },
    output: {
      publicPath: "/",
      path: config.outputPath,
      filename: `js/[name].js?[${config.hashType}]`,
      chunkFilename: `js/[name].js?[${config.hashType}]`,
    },
    module: {
      noParse: /^(vue|vue-router|vuex|vuex-router-sync|varie)$/,
      rules: [
        require("./build/loaders/ts")(config),
        require("./build/loaders/vue")(config),
        require("./build/loaders/scss")(config),
        require("./build/loaders/html")(config),
        require("./build/loaders/fonts")(config),
        require("./build/loaders/images")(config),
      ],
    },
    plugins: [
      require("./build/plugins/define")({
        ENV: config.mode,
      }),
      require("./build/plugins/html")(config),
      require("./build/plugins/vue")(config),
      ...loadIf(!config.isHot, [
        require("./build/plugins/clean")(config),
        require("./build/plugins/cssExtract")(config),
      ]),
      ...loadIf(!config.isProduction, [
        require("./build/plugins/errors")(config),
        require("./build/plugins/browserSync")(config),
        require("./build/plugins/notifications")(config),
      ]),
      ...loadIf(config.isProduction, [
        require("./build/plugins/hashedModuleIds")(config),
      ]),
      ...loadIf(config.isAnalyzing, [
        require("./build/plugins/bundleAnalayzer")(config),
      ]),
    ],
    resolve: {
      symlinks: false,
      extensions: [".js", ".jsx", ".ts", ".tsx", ".vue", ".json"],
      alias: {
        vue$: "vue/dist/vue.esm.js",
        "@app": path.join(config.root, "app"),
        "@routes": path.join(config.root, "routes"),
        "@config": path.join(config.root, "config"),
        "@store": path.join(config.root, "app/store"),
        "@models": path.join(config.root, "app/models"),
        "@resources": path.join(config.root, "resources"),
        "@views": path.join(config.root, "resources/views"),
        "@components": path.join(config.root, "app/components"),
      },
    },
    stats: require("./build/stats")(config),
    devServer: require("./build/devServer")(config),
  };
};
