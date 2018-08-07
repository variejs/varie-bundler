const Plugin = require("./Plugin");

module.exports = class DefineEnvironmentVariables extends Plugin {
  register() {
    let variables = {
      ENV: JSON.stringify(this.env.mode)
    };

    for (let variableName in this.config.environmentVariables) {
      variables[variableName] = JSON.stringify(
        this.config.environmentVariables[variableName]
      );
    }

    this.webpackChain.plugin("variables").use(this.webpack.DefinePlugin, [
      {
        __ENV_VARIABLES__: variables
      }
    ]);
  }
};
