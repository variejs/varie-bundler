module.exports = require("babel-loader").custom(() => {
  return {
    config(cfg) {
      cfg.options.presets.map(preset => {
        if (preset.file.request === "varie-app") {
          if (!preset.options) {
            preset = Object.assign({}, preset, { options: {} });
          }
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
