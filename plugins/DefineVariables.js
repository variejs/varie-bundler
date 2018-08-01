const Plugin = require("./Plugin");

module.exports = class DefineVariables extends Plugin {
  boot() {
    return new this.webpack.DefinePlugin(
      this.merge(
        {
          ENV: this.config.mode
        },
        this.config.variables
      )
    );
  }
};
