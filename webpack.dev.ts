const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const common = require("./webpack.common")
const {merge} = require("webpack-merge");
process.env.HOT = "true";
process.env.NODE_ENV = "development";
module.exports =  merge(common, {
    mode: "development",
    optimization:{
        runtimeChunk: 'single'
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "build")
    },
    module: {
        rules: [
            {
                test: /\.[j|t]sx?$/i,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: [
                        ]
                    }
                }
            },
            {
                test: /\.(s[ac]|c)ss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            chunks: ['main'],
        }),
        new HtmlWebpackPlugin({
            template: "./src/lab1/index.html",
            filename: "lab1/index.html",
            chunks: ['lab1'],
        }),
        new HtmlWebpackPlugin({
            template: "./src/lab2/index.html",
            filename: "lab2/index.html",
            chunks: ['lab2'],
        }),
        new HtmlWebpackPlugin({
            template: "./src/lab3/index.html",
            filename: "lab3/index.html",
            chunks: ['lab3'],
        }),
        new HtmlWebpackPlugin({
            template: "./src/lab4/index.html",
            filename: "lab4/index.html",
            chunks: ['lab4'],
        })
    ],
    devtool: "source-map",
    devServer: {
        contentBase: "./build",
        hot: true,
        open: true,
        historyApiFallback: true
    }
});