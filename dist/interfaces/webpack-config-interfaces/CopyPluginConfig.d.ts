interface CopyConfig {
  to: String;
  from: String;
}
export interface CopyPluginConfig {
  patterns: Array<CopyConfig>;
}
export {};
