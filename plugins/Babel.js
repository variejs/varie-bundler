const Plugin = require("./Plugin");
module.exports = class Babel extends Plugin {
  register() {
    this.webpackChain.module
      .rule("typescript")
      .use("babel-loader")
      .tap(() => {
        let targets = {
          browsers: [
            "Chrome >= 49",
            "Firefox >= 45",
            "Safari >= 10",
            "Edge >= 13",
            "iOS >= 10",
            "Electron >= 0.36"
          ]
        };
        if (this.modernBuild) {
          targets = {
            esmodules: true
          };
        }

        return {
          presets: [
            [
              "@babel/preset-env",
              {
                targets,
                loose: false,
                debug: false,
                modules: false,
                useBuiltIns: "entry",
                ignoreBrowserslistConfig: this.modernBuild
              }
            ]
          ],
          plugins: [
            ["@babel/plugin-syntax-dynamic-import"],
            [
              "@babel/plugin-transform-runtime",
              {
                regenerator: true,
                corejs: false,
                helpers: true,
                useESModules: true
              }
            ],
            [
              "@babel/plugin-proposal-object-rest-spread",
              {
                useBuiltIns: "entry"
              }
            ]
          ]
        };
      });
  }
};
