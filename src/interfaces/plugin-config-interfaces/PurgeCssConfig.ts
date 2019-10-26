export interface PurgeCssConfig {
  paths: Array<string>;
  whitelistSelectors: Array<string>;
  whiteListPatterns: Array<RegExp>;
  whitelistPatternsChildren: Array<RegExp>;
}
