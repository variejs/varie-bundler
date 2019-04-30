interface CopyConfig {
  from: String;
  to: String;
}
export interface CopyPluginConfig {
  patterns: Array<CopyConfig>;
}
export {};
