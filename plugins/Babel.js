const Plugin = require("./Plugin");

module.exports = class Babel extends Plugin {
  register() {
    this.webpackChain.module
      .rule("js")
      .exclude.add(filepath => {
        // always transpile js in vue files
        if (/\.vue\.jsx?$/.test(filepath)) {
          return false;
        }

        // if(/.*varie.*/.test(filepath)) {
        //   return false;
        // }

        // Don't transpile node_modules
        return /node_modules/.test(filepath);
      })
      .end()
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
        if (this.modern) {
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
                ignoreBrowserslistConfig: this.modern
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
