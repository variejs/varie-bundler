const Plugin = require("./Plugin");

module.exports = class DefineVariables extends Plugin {
  boot() {
    return new this.webpack.DefinePlugin({
      process: this.merge(
        {
          ENV: JSON.stringify(this.env.mode)
        },
        this.data.variables
      )
    });
  }
};
