import hash from "hash-sum";
import webpack from "webpack";
import Plugin from "./Plugin";
import NamedChunksPlugin from "webpack/lib/NamedChunksPlugin";

import Chunk = webpack.compilation.Chunk;
export default class NamedChunks extends Plugin<undefined> {
  protected options: undefined;
  public register() {
    // keep chunk ids stable so async chunks have consistent hash (https://github.com/vuejs/vue-cli/issues/1916)
    this.bundler.webpackChain.plugin("named-chunks").use(NamedChunksPlugin, [
      (chunk: Chunk) => {
        if (chunk.name) {
          return chunk.name;
        }
        const joinedHash = hash(
          Array.from(chunk.modulesIterable, (m) => {
            return m.id;
          }).join("_"),
        );
        return `chunk-` + joinedHash;
      },
    ]);
  }
}
