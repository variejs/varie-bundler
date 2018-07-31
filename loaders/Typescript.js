const loadIf = require('./../build/helpers/loadIf');

module.exports = class Typescript {
    constructor(config) {
        this.config = config;
    }

    rules() {
        return {
            test: /\.tsx?$/,
            use: [
                ...loadIf(!this.config.isProduction, ["cache-loader"]),
                {
                    loader: "babel-loader",
                },
                {
                    loader: "ts-loader",
                    options: {
                        appendTsSuffixTo: [/\.vue$/],
                    },
                },
            ],
            exclude: /node_modules/,
        };
    }
}