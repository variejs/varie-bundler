import VueConfig from "./VueConfig";
import { HashTypes } from "../types/HashTypes";
import { PurgeCssConfig } from "./plugin-config-interfaces/PurgeCssConfig";
import { CopyPluginConfig } from "./plugin-config-interfaces/CopyPluginConfig";
import { CleanPluginConfig } from "./plugin-config-interfaces/CleanPluginConfig";
import { WebpackDevServerConfig } from "./web-config-interfaces/WebpackDevServerConfig";
import { BrowserSyncPluginConfig } from "./plugin-config-interfaces/BrowserSyncPluginConfig";
import { DefineVariablePluginConfig } from "./plugin-config-interfaces/DefineVariablePluginConfig";
import { HtmlWebpackPluginConfig } from "./plugin-config-interfaces/HtmlWebpackPluginConfig";

export default interface BundlerConfig {
  root: string;
  host: string;
  cache: boolean;
  appName: string;
  outputPath: string;
  hashType: HashTypes;
  bundleName?: string;
  aggressiveVendorSplitting: boolean;
  plugins: {
    copy: CopyPluginConfig;
    clean: CleanPluginConfig;
    purgeCss?: PurgeCssConfig;
    html: HtmlWebpackPluginConfig;
    browserSync: BrowserSyncPluginConfig;
    defineEnvironmentVariables: DefineVariablePluginConfig;
  };
  loaders: {
    sassLoader: {
      globalIncludes: Array<string>;
    };
  };
  webpack: {
    entryFiles: Array<string>;
    devServer: WebpackDevServerConfig;
    aliases: { [key: string]: string };
  };
  vue: VueConfig;
}
