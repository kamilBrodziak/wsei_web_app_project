module.exports = (api) => {
    api.cache.using(() => `${process.env.NODE_ENV}-${process.env.HOT}`);
    const plugins = [
        "@babel/proposal-class-properties",
        "@babel/proposal-object-rest-spread",
        "@babel/plugin-transform-runtime"
    ]
    return {
        presets: [
            ["@babel/preset-env",
                {
                    useBuiltIns: "entry"
                }
            ],
            "@babel/preset-typescript",
        ],
        plugins: plugins
    }
}