module.exports = require("babel-loader").custom(() => {
  return {
    customOptions(loader) {
      const custom = {
        entryFiles: loader.entryFiles,
        modernBuild: loader.modernBuild || false,
      };

      delete loader.entryFiles;
      delete loader.modernBuild;

      return { custom, loader };
    },
    config(cfg, { customOptions }) {
      cfg.options.presets.map((preset) => {
        if (preset.file.request === "varie-app") {
          preset.options.modern = customOptions.modernBuild;
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
