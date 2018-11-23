module.exports = require("babel-loader").custom(() => {
  console.info("CUSTOM ONE");
  return {
    config(cfg) {
      cfg.options.presets.map(preset => {
        if (preset.file.request === "varie-app") {
          preset.options.modern = true;
        }
      });
      return {
        ...cfg.options,
        plugins: [...(cfg.options.plugins || [])]
      };
    }
  };
});
