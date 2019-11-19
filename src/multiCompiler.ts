import webpack from "webpack";
import Bundler from "./interfaces/Bundler";

export default function multiCompiler(configs: {
  [key: string]: Bundler;
}): Array<webpack.Configuration> {
  let devServerPort;
  let writeToDiskFunctions = [];
  for (let configName in configs) {
    let builder: Bundler = configs[configName];
    if (!builder.build) {
      throw Error("To use Multi-Compiler you must supply a webpack-chain.");
    }

    let writeToDiskFunction = builder.webpackChain.devServer.get("writeToDisk");
    if (writeToDiskFunction) {
      writeToDiskFunctions.push(writeToDiskFunction);
    }
  }

  let builds = [];
  Object.values(configs).map((bundler: Bundler, index) => {
    if (index === 0) {
      devServerPort = bundler.config.webpack.devServer.port;
      bundler.webpackChain.devServer.set("writeToDisk", (filePath) => {
        return writeToDiskFunctions.reduce((writeToDiskFunction, val) => {
          return writeToDiskFunction && writeToDiskFunction(filePath) && val;
        });
      });
    } else {
      bundler.webpackChain.devServer.port(devServerPort);
      bundler.webpackChain.devServer.delete("writeToDisk");
    }
    builds.push(...bundler.build());
  });

  return builds;
}
