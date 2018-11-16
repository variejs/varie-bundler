const Plugin = require("./Plugin");
const NamedChunksPlugin = require("webpack/lib/NamedChunksPlugin");
module.exports = class NamedChunks extends Plugin {
  register() {
    // keep chunk ids stable so async chunks have consistent hash (https://github.com/vuejs/vue-cli/issues/1916)
    this.webpackChain.plugin("named-chunks").use(NamedChunksPlugin, [
      chunk => {
        if (chunk.name) {
          return chunk.name;
        }

        const hash = require("hash-sum");
        const joinedHash = hash(
          Array.from(chunk.modulesIterable, m => m.id).join("_")
        );
        return `chunk-` + joinedHash;
      }
    ]);
  }
};
