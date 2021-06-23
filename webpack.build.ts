const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const common = require("./webpack.common")
const {merge} = require("webpack-merge")
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin")
process.env.HOT = "false";
process.env.NODE_ENV = "production";
module.exports =  merge(common, {
    mode: "production",
    output: {
        filename: "[name].[contenthash].bundle.js",
        path: path.resolve(__dirname, "build"),
        assetModuleFilename: "images/[hash][ext]"
    },
    optimization: {
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserPlugin()
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css"
        }),
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            chunks: ['main'],
            minify: {
                removeComments: true,
                removeAttributeQuotes: true,
                collapseWhitespace: true
            }
        }),
        new HtmlWebpackPlugin({
            template: "./src/lab1/index.html",
            filename: "lab1/index.html",
            chunks: ['lab1'],
            minify: {
                removeComments: true,
                removeAttributeQuotes: true,
                collapseWhitespace: true
            }
        }),
        new HtmlWebpackPlugin({
            template: "./src/lab2/index.html",
            filename: "lab2/index.html",
            chunks: ['lab2'],
            minify: {
                removeComments: true,
                removeAttributeQuotes: true,
                collapseWhitespace: true
            }
        })
    ],
    module: {
        rules: [
            {
                test: /\.[j|t]sx?$/i,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                }
            },
            {
                test: /\.(s[ac]|c)ss$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {publicPath: ""}
                }, 'css-loader', "postcss-loader", 'sass-loader'],
            },
        ],
    }
});