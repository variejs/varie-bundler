const path = require('path');
const Plugin = require("./Plugin");

module.exports = class LaravelPlugin extends Plugin {
  register() {
    let fileName = `${path.join(this.options.root, this.options.destination)}/${this.options.layout}.blade.php`
    this.webpackChain.when(!this.env.isHot, (config) => {
          config.plugin("html").tap((opts) => {
          opts[0].filename = fileName;
          return opts;
      });
    });
  }
};
