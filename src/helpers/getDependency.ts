import childProcess from "child_process";

export default function getDependency<T>(dependency): () => T {
  try {
    return require(dependency);
  } catch (e) {
    console.log(`Installing ${dependency}.`);
    childProcess.execSync(`npm install ${dependency} --save-dev`);
    console.log("Finished, re-run this command.");
    return process.exit(0);
  }
}
