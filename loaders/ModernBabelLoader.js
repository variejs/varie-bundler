// Export from "./my-custom-loader.js" or whatever you want.
module.exports = require("babel-loader").custom(babel => {
	return {
		config(cfg) {

			// TODO - pass modern through to varie-app preset
			// console.info(cfg.options.presets);
			// if (cfg.hasFilesystemConfig()) {
			// 	// Use the normal config
			// 	return cfg.options;
			// }

			return {
				...cfg.options,
				plugins: [
					...(cfg.options.plugins || []),
				],
			};
		},

	};
});