const path = require("path");

module.exports = {
    entry: {
        "./js/app.js": "./src/js/app.js",
        "./js/login.js": "./src/js/login.js",
    },
    mode: "development",
    output: {
        filename: "[name]",
        path: path.resolve(__dirname, "dist"),
    },
    devServer: {
        port: 3000,
        open: true,
        static: "dist",
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
        ],
    },
};
