const Plugin = require("./Plugin");

module.exports = class Babel extends Plugin {
  register() {
    this.webpackChain.module
      .rule("js")
      .use("babel-loader")
      .tap(() => {
        let targets = {
          browsers: [
            "> 1%",
            "last 50 versions",
            "not ie <= 8"
          ]
        }
        if(this.modern) {
          targets =  {
           browsers : [
             "last 1 versions",
           ]
          };
        }

        return {
          presets: [
            [
              '@babel/preset-env', {
                targets,
                modules: false,
                useBuiltIns: 'entry',
              }
            ],
          ],
          plugins: [
            "@babel/plugin-syntax-dynamic-import"
            // "@babel/plugin-transform-runtime", {
            //   "regenerator": true
            // }
          ]
        };
      });
  }
};
