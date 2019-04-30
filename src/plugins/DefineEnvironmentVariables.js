const Plugin = require("./Plugin");
const { DefinePlugin } = require("webpack");
module.exports = class DefineEnvironmentVariables extends Plugin {
  register() {
    let variables = {
      app: {
        env: this.env.mode,
      },
    };

    for (let variableName in this.options.variables) {
      variables[variableName] = Object.assign(
        {},
        variables[variableName],
        this.options.variables[variableName],
      );
    }

    this.webpackChain.plugin("variables").use(DefinePlugin, [
      {
        __ENV_VARIABLES__: this._stringify(variables),
      },
    ]);
  }

  _stringify(variables) {
    for (let variable in variables) {
      let tempVariable = variables[variable];
      if (typeof variables[variable] === "object") {
        variables[variable] = this._stringify(tempVariable);
        continue;
      }
      variables[variable] = JSON.stringify(variables[variable]);
    }
    return variables;
  }
};
