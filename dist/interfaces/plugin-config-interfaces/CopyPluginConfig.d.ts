interface CopyConfig {
  to: string;
  from: string;
}
export interface CopyPluginConfig {
  patterns: Array<CopyConfig>;
}
export {};
