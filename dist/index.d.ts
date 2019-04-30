import { EnvironmentTypes } from "./types/EnvironmentTypes";
import VarieBundlerConfig from "./interfaces/VarieBundlerConfig";
export default class VarieBundler {
  private config;
  private env;
  private webpackChain;
  constructor(mode?: EnvironmentTypes, config?: VarieBundlerConfig);
  aliases(aliases: Array<String>): this;
  build(): Array<object> | void;
  browserSync(options?: {}): this;
  chainWebpack(callback: any): this;
  copy(from: any, to?: string): this;
  dontClean(exclude: any): this;
  entry(name: string, entryPaths: Array<string>): this;
  plugin(Plugin: any, options: any): this;
  proxy(
    from: any,
    to: any,
    options?: {
      changeOrigin: boolean;
    },
  ): this;
  varieConfig(variables: any): this;
  webWorkers(): this;
  private argumentsHas;
  private bundle;
  private inspect;
  private setupConfig;
  private setupEnv;
  private presets;
  private makeModernBundle;
  private updateJavascriptLoaders;
}
