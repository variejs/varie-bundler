const Config = require("./Config");
module.exports = class Extensions extends Config {
  register() {
    this.webpackChain.resolve.extensions
      .add(".js")
      .add(".jsx")
      .add(".ts")
      .add(".tsx")
      .add(".vue")
      .add(".json")
      .end();
  }
};
