'use strict';

const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: './lib/static/genetic.js',
    output: {
        filename: 'bundle.js',
        path: __dirname
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {minimize: false}
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: './lib/static/index.html',
            filename: './index.html'
        }),
        new MiniCssExtractPlugin({
            filename: 'bundle.css'
        })
    ]
};
