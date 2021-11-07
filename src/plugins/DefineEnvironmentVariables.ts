import Plugin from "./Plugin";
import { DefinePlugin } from "webpack";
import { DefineVariablePluginConfig } from "../interfaces/plugin-config-interfaces/DefineVariablePluginConfig";

export default class DefineEnvironmentVariables extends Plugin<DefineVariablePluginConfig> {
  public register() {
    let variables = {
      app: {
        env: this.bundler.env.mode,
      },
    };

    for (let variableName in this.options.variables) {
      variables[variableName] = Object.assign(
        {},
        variables[variableName],
        this.options.variables[variableName],
      );
    }

    this.bundler.webpackChain.plugin("variables").use(DefinePlugin, [
      {
        __ENV_VARIABLES__: this.stringify(variables),
      },
    ]);
  }

  private stringify(variables) {
    for (let variable in variables) {
      let tempVariable = variables[variable];
      if (typeof variables[variable] === "object") {
        variables[variable] = this.stringify(tempVariable);
        continue;
      }
      variables[variable] = JSON.stringify(variables[variable]);
    }
    return variables;
  }
}
