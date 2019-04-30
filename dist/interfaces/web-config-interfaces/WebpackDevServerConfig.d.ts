interface WebpackProxyConfig {
  target: string;
  context: Array<String>;
}
export interface WebpackDevServerConfig {
  host: string;
  open: boolean;
  proxies: Array<WebpackProxyConfig>;
}
export {};
