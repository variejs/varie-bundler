const loadIf = require("./../helpers/loadIf");

module.exports = class Loader {
  constructor(env, config) {
    this.env = env;
    this.config = config;
    this.loadIf = loadIf;
  }
};
