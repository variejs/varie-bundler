export interface PurgeCssConfig {
  paths: Array<string>;
  whiteListPatterns?: Array<RegExp>;
  whitelistSelectors?: Array<string>;
  whitelistPatternsChildren?: Array<RegExp>;
}