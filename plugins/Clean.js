const Plugin = require("./Plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = class Clean extends Plugin {
  register() {
    let cleanPatterns = ["**/*"];

    this.options.excludeList.forEach((pattern) => {
      cleanPatterns.push(`!${pattern}`);
      cleanPatterns.push(`!${pattern}/**/*`);
    });

    this.webpackChain.plugin("clean").use(CleanWebpackPlugin, [
      {
        cleanOnceBeforeBuildPatterns: cleanPatterns,
      },
    ]);
  }
};
