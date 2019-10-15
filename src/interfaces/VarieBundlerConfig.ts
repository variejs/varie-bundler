import VueConfig from "./VueConfig";
import { HashTypes } from "../types/HashTypes";
import { CopyPluginConfig } from "./plugin-config-interfaces/CopyPluginConfig";
import { CleanPluginConfig } from "./plugin-config-interfaces/CleanPluginConfig";
import { WebpackDevServerConfig } from "./web-config-interfaces/WebpackDevServerConfig";
import { BrowserSyncPluginConfig } from "./plugin-config-interfaces/BrowserSyncPluginConfig";
import { DefineVariablePluginConfig } from "./plugin-config-interfaces/DefineVariablePluginConfig";

export default interface VarieBundlerConfig {
  root: string;
  host: string;
  cache: boolean;
  modern: boolean;
  appName: string;
  outputPath: string;
  hashType: HashTypes;
  bundleName?: string;
  plugins: {
    copy: CopyPluginConfig;
    clean: CleanPluginConfig;
    browserSync: BrowserSyncPluginConfig;
    defineEnvironmentVariables: DefineVariablePluginConfig;
  };
  loaders: {
    sassLoader: {
      globalIncludes: Array<string>;
    };
  };
  webpack: {
    aliases: Array<string>;
    entryFiles: Array<string>;
    devServer: WebpackDevServerConfig;
  };
  vue: VueConfig;
}
