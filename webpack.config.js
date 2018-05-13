'use strict';

const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        'one-tsp': './lib/react/pages/one-tsp.js',
        'multiple-tsp': './lib/react/pages/multiple-tsp.js'
    },
    output: {
        filename: '[name].js',
        path: `${__dirname}/dist`
    },
    devtool: 'source-map',
    devServer: {
        publicPath: '/dist/'
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
            },
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: './lib/react/pages/one-tsp.html',
            chunks: ['one-tsp'],
            filename: 'one-tsp.html'
        }),
        new HtmlWebPackPlugin({
            template: './lib/react/pages/multiple-tsp.html',
            chunks: ['multiple-tsp'],
            filename: 'multiple-tsp.html'
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css'
        })
    ]
};
