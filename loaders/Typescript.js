const Loader = require("./Loader");
const loadIf = require("./../helpers/loadIf");

module.exports = class Typescript extends Loader {
  rules() {
    return {
      test: /\.tsx?$/,
      use: [
        ...loadIf(!this.config.isProduction, ["cache-loader"]),
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
