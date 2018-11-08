let scripts = [];
const Plugin = require("./Plugin");

module.exports = class MultiBuild extends Plugin {
  register() {
    this.webpackChain.plugin("multi-build").use(MultiBuildHtml);
  }
};

function MultiBuildHtml() {}

MultiBuildHtml.prototype = {
  apply: function(compiler) {
    compiler.hooks.compilation.tap("MultiBuild", compilation => {
      compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration.tapAsync(
        "MultiBuild",
        this.beforeHtmlGeneration.bind(this)
      );
    });
  },

  beforeHtmlGeneration: function(data, cb) {
    scripts = scripts.concat(data.assets.js);
    data.assets.js = scripts;
    data.plugin.options.scripts = scripts;
    cb(null, data);
  }
};
