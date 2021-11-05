import babelLoader from "babel-loader";

export default babelLoader.custom(() => {
  return {
    customOptions(loader) {
      const custom = {
        entryFiles: loader.entryFiles,
      };

      delete loader.entryFiles;

      return { custom, loader };
    },
    config(cfg, { customOptions }) {
      cfg.options.presets.map((preset) => {
        if (preset.file.request === "varie-app") {
          preset.options.entryFiles = customOptions.entryFiles;
        }
        return preset;
      });
      return {
        ...cfg.options,
        plugins: [...(cfg.options.plugins || [])],
      };
    },
  };
});
