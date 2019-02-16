const webpack = require("webpack");
const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        index: path.join(__dirname, './src/index.ts')
    },
    output: {
        path: path.join(__dirname, './build/js'),
        filename: '[name].js'
    },
    optimization: {
        splitChunks: {
            name: 'bundle',
            chunks: "initial"
        }
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    plugins: [
        // exclude locale files in moment
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ]
};