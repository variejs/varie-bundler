const Babel = require("./Babel");
const Clean = require("./Clean");
const Errors = require("./Errors");
const Preload = require("./Preload");
const MultiBuild = require("./MultiBuild");
const BrowserSync = require("./BrowserSync");
const NamedChunks = require("./NamedChunks");
const HashedModules = require("./HashedModules");
const BundleAnalyzer = require("./BundleAnalyzer");
const CaseSensitivePaths = require("./CaseSensitivePaths");
const DefineEnvironmentVariables = require("./DefineEnvironmentVariables");

module.exports = {
  Babel,
  Clean,
  Errors,
  Preload,
  MultiBuild,
  BrowserSync,
  NamedChunks,
  HashedModules,
  BundleAnalyzer,
  CaseSensitivePaths,
  DefineEnvironmentVariables
};
