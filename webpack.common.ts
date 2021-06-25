module.exports =  {
    entry: {
        main: "./src/index.ts",
        lab1: './src/lab1/index.ts',
        lab2: './src/lab2/index.ts',
        lab3: './src/lab3/index.ts'
    },
    output: {
        publicPath: '/'
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx" ]
    },
    module: {
        rules: [
            {
                test: /\.html$/i,
                use: ['html-loader']
            },
            {
                test: /\.(svg|png|jpe?g|gif)$/i,
                type: 'asset',
                // use: {
                //     loader: "file-loader",
                //     options: {
                //         name: "[name].[ext]",
                //         outputPath: "imgs"
                //     }
                // }
            }
        ]
    }
}