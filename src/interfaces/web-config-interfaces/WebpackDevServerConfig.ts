interface WebpackProxyConfig {
  target: string;
  context: Array<string>;
  changeOrigin: boolean;
}

export interface WebpackDevServerConfig {
  host: string;
  open: boolean;
  proxies: Array<WebpackProxyConfig>;
}
