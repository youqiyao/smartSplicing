export default {
    development: {
        cssSourceMap: false,
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: './',          //请根据自己路径配置更改
        staticPath:'./static/',          //请根据自己路径配置更改
        autoOpenBrowser: true,
        productionSourceMap: false,
    },
    prodction: {
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: './',          //请根据自己路径配置更改
        staticPath:'./static/',          //请根据自己路径配置更改
    }
}