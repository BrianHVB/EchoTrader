const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path');

module.exports = {
	entry: {
		'main': './src/index.js',
		'main2': `./src/index2.js`
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader"
				}
			},

			{
				test: /\.html$/,
				exclude: /node_modules/,
				use: [
					{
						loader: "html-loader",
						options: {minimize: true}
					}
				]
			},

			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			}
		]
	},

	plugins: [
		new HtmlWebPackPlugin({
			template: "./src/html/index.html",
			filename: "./index.html",
			chunks: [`main`]
		}),
		new HtmlWebPackPlugin({
			template: "./src/html/index.html",
			filename: "./index2.html",
			chunks: [`main2`]
		})
	]
};