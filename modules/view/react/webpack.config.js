const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path');

module.exports = {
	entry: {
		"marketWatchApp": `./src/marketWatchApp.js`
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
		// new HtmlWebPackPlugin({
		// 	template: "./src/html/index.html",
		// 	filename: "./samples.html",
		// 	chunks: [`samples`]
		// }),
		new HtmlWebPackPlugin({
			template: "./src/html/index.html",
			filename: "./index.html",
			chunks: [`marketWatchApp`]
		}),
		// new HtmlWebPackPlugin({
		// 	template: "./src/html/index.html",
		// 	filename: "./index.html",
		// 	chunks: [`todoList`]
		// })
		// 	new HtmlWebPackPlugin({
		// 		template: "./src/html/index.html",
		// 		filename: "./index.html",
		// 		chunks: ['tttExample']
		// 	})
	],

	devServer: {
		historyApiFallback: true,
		open: true
	},

	resolve: {
		modules: [
			path.resolve(__dirname, 'src'),
			"node_modules",
		]
	}
};