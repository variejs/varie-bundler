const Plugin = require("./Plugin");

module.exports = class DefineVariables extends Plugin {
  boot() {
    return new this.webpack.DefinePlugin(
      this.merge(
        {
          ENV: JSON.stringify(this.config.mode)
        },
        this.data.variables
      )
    );
  }
};
