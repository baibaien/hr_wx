var path = require('path');
var pkg = require('./package.json');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        app: __dirname + '/src/index.jsx',
        vendor: Object.keys(pkg.dependencies),
        // vendor1: ['react', 'react-dom', 'es6-promise', 'react-router-dom', 'react-router','whatwg-fetch'],
        // vendor2: ['jroll', 'react-fastclick', 'react-dropzone', 'react-lazy-load']
    },
    output: {
        filename: "./js/[name]_[chunkhash:16].js",
        path: __dirname + '/build',
        publicPath: '/'
    },
    resolve: {
        extensions: [
            '.jsx', '.js', '.json'
        ]
    },
    module: {
        rules: [
            {test: /\.(js|jsx)$/, exclude: /node_modules/, loader: 'babel-loader'},
            {test: /\.less$/, exclude: /node_modules/, loader: 'style-loader!css-loader!less-loader'},
            {test: /\.css$/, exclude: /node_modules/, loader: 'style-loader!css-loader'},
            {test: /\.(png|gif|jpg|jpeg|bmp)$/i, loader: 'url-loader?limit=5000'},
            {test: /\.(png|woff|woff2|svg|ttf|eot)($|\?)/i, loader: 'url-loader?limit=5000'},
            {enforce: 'pre', test: /\.js$/, loader: 'source-map-loader'}
        ]
    },
    plugins: [
        require('autoprefixer'),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'index.html')
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
                // 'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            }
        }),

        new webpack.optimize.OccurrenceOrderPlugin(),

        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),

        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            // names: ['vendor2', 'vendor1'],
            minChunks: Infinity,
            filename: './js/[name].js'
        })
    ],
    devServer: {
        contentBase: './',
        historyApiFallback: true,
        inline: true,
        hot: true
    }
};