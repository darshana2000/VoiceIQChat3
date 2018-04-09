"use strict";

module.exports = {
    entry: "./index.js",
    output: {
        filename: "bundle.js"
    },
    debug: true,
    devtool: "#eval-source-map",
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                query: {
                    presets: ["es2015", "react"]
                }
            }
        ]
    }
};