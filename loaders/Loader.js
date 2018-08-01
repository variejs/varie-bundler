const loadIf = require("./../helpers/loadIf");

module.exports = class Loader {
  constructor(config) {
    this.config = config;
    this.loadIf = loadIf;
  }
};
