import Plugin from "./Plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin/dist/clean-webpack-plugin";
import { CleanPluginConfig } from "../interfaces/plugin-config-interfaces/CleanPluginConfig";

export default class Clean extends Plugin<CleanPluginConfig> {
  public register() {
    let cleanPatterns = ["**/*"];

    this.options.excludeList.forEach((pattern) => {
      cleanPatterns.push(`!${pattern}`);
      cleanPatterns.push(`!${pattern}/**/*`);
    });

    this.varieBundler.webpackChain.plugin("clean").use(CleanWebpackPlugin, [
      {
        cleanOnceBeforeBuildPatterns: cleanPatterns,
      },
    ]);
  }
}
