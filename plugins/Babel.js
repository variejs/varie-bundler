const Plugin = require("./Plugin");
module.exports = class Babel extends Plugin {
  register() {
    this.webpackChain.module
      .rule("js")
      .use("babel-loader")
      .tap(() => {
        let targets = undefined;
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
                useBuiltIns: "usage",
                ignoreBrowserslistConfig: this.modernBuild
              }
            ]
          ],
          plugins: [
            ["@babel/plugin-syntax-dynamic-import"],
            [
              "@babel/plugin-transform-runtime",
              {
                regenerator: false,
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
