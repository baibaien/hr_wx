var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname + '/src/index.jsx'),
    output: {
        filename: 'bundle.js',
        publicPath: 'http://localhost:8080/'
    },
    devtool: 'eval-source-map',
    resolve: {
        extensions: [
            '.jsx', '.js', '.web', '.webpack.js', '.json'
        ],
        // alias: {
        //     'react': path.join(_dirname, 'node_modules', 'react')
        // }
    },
    module: {
        rules: [
            {test: /\.(js|jsx)$/, exclude: /node_modules/, loader: 'babel-loader'},
            {test: /\.less$/, exclude: /node_modules/, loader: 'style-loader!css-loader!less-loader'},
            {test: /\.css$/, exclude: /node_modules/, loader: 'style-loader!css-loader'},
            {test: /\.(png|gif|jpg|jpeg|bmp)$/i, exclude: /node_modules/, loader: 'url-loader?limit=5000'},
            {test: /\.(png|woff|woff2|svg|ttf|eot)($|\?)/i, exclude: /node_modules/, loader: 'url-loader?limit=5000'},
            {enforce: 'pre', test: /\.js$/, exclude: /node_modules/, loader: 'source-map-loader'}
        ]
    },
    plugins: [
        require('autoprefixer'),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'index.html')
        }),
        new webpack.HotModuleReplacementPlugin(),
        new OpenBrowserPlugin({
            url: 'http://localhost:8080'
        })
    ],
    devServer: {
        contentBase: './',
        historyApiFallback: true,
        hot: true,
        inline: true,
        port: 8080,
    }
};