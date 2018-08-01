const Loader = require("./Loader");

module.exports = class Typescript extends Loader {
  rules() {
    return {
      test: /\.tsx?$/,
      use: [
        ...this.loadIf(!this.config.isProduction, ["cache-loader"]),
        {
          loader: "babel-loader"
        },
        {
          loader: "ts-loader",
          options: {
            appendTsSuffixTo: [/\.vue$/]
          }
        }
      ],
      exclude: /node_modules/
    };
  }
};
