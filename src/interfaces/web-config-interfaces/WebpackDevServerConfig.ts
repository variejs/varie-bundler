interface WebpackProxyConfig {
  target: string;
  context: Array<String>;
  changeOrigin: boolean;
}

export interface WebpackDevServerConfig {
  host: string;
  open: boolean;
  proxies: Array<WebpackProxyConfig>;
}
