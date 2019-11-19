import Plugin from "./Plugin";
import { HashedModuleIdsPlugin } from "webpack";
export default class HashedModules extends Plugin<undefined> {
  public register() {
    this.bundler.webpackChain
      .plugin("hashed-modules")
      .use(HashedModuleIdsPlugin, [
        {
          hashFunction: "sha256",
          hashDigest: "hex",
          hashDigestLength: 20,
        },
      ]);
  }
}
