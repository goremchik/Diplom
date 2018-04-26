const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');



const env = process.argv[process.argv.length - 1];
const isProduction = env === 'production';
const dist = path.join(__dirname, 'dist');
const app = path.join(__dirname, 'app/');

module.exports = {
	context: __dirname,
	entry: {
		index: app + 'index'
	},
	output: {
		path: dist,
		filename: '[name].js'
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [{
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				},  'eslint-loader']
			}, {
				test: /\.less$/,
				exclude: /node_modules/,
				use: ExtractTextPlugin.extract({
					use: [{
						loader: "css-loader",
						options: {
							minimize: isProduction
						}
					}, 'postcss-loader', 'less-loader']
				})
			}, {
				test: /\.(png|jpg|gif)$/,
				use: [{
					loader: 'url-loader',
					options: {
						limit: 1024
					}
				}]
			}
		]
	},
    //
	plugins: [
		new ExtractTextPlugin('[name].css'),
		new CleanWebpackPlugin(dist),
		new CopyWebpackPlugin([
			{
				from: '*.html',
				context: app,
				to: './',
				flatten: true
			}, {
				from: './app/index.html',
				to: './'
			}, {
				from: './favicon.ico',
				to: './'
			}
		])

	],

	watch: !isProduction,
	watchOptions: {
		aggregateTimeout: 100
	},

	devtool: !isProduction ? "source-map" : false,

	devServer: {
		contentBase: dist,
		port: 8000,
		compress: true
	},

	optimization: {
		minimize: isProduction,
		splitChunks: {
			cacheGroups: {
				commons: {
					name: "commons",
					chunks: "initial",
					minChunks: 2,
					maxInitialRequests: 5,
					minSize: 0
				}
			}
		}
	}

};
