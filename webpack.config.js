var path = require('path');
var webpack = require('webpack');

// 插件

// 格式化，最小化，等操作
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// 加载文件插件
var ExtractTextPlugin = require("extract-text-webpack-plugin");

// 处理HTML插件
var HtmlWebpackPlugin = require('html-webpack-plugin');

var pxtorem = require('postcss-pxtorem');

module.exports = {

    entry: {
        index: './src/entry/index.js',
        items: './src/entry/items.js'
    },
    output:{
        path: __dirname+'/dist/',
        filename: 'js/[name].js'
    },
    devtool: "source-map",
    resolve: {

        // 搜索目录
        modules:[
            'node_modules',
            'src/vendors'
        ],

        // 读取配置文件
        descriptionFiles: ["package.json", "bower.json"],
    },
    module:{
        rules:[
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'less-loader', 'postcss-loader']
                })
            },{
                test: /\.html$/,
                use: ['html-loader']
            }
        ]
    },
    plugins: [

        //当碰到这个模块时加载
        new webpack.ProvidePlugin({
            $: 'jquery'
        }),

        //提取公共部分
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors', // 将公共模块提取，生成名为`vendors`的chunk
            chunks: ['index','items'], //提取哪些模块共有的部分
            minChunks: 2 // 提取至少3个模块共有的部分
        }),

        //页面使用HTMLloader
        new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
            template: './src/view/index.html', //html模板路径
            filename: './view/index.html', //生成的html存放路径，相对于path
            inject: 'body', //js插入的位置，true/'head'/'body'/false
            hash: true, //为静态资源生成hash值
            chunks: ['vendors', 'index'],//需要引入的chunk，不配置就会引入所有页面的资源
            minify: { //压缩HTML文件
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: false //删除空白符与换行符
            }
        }),

        // new UglifyJsPlugin({beautify: true}),
        new ExtractTextPlugin('css/[name].css'),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: function () {
                    return [pxtorem({propList:['*']})];
                }
            }
        })
    ]
};
