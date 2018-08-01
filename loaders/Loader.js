const useIf = require("./../helpers/useIf");

module.exports = class Loader {
  constructor(env, config) {
    this.env = env;
    this.useIf = useIf;
    this.config = config;
  }
};
