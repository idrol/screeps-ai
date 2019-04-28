module.exports = {
	entry: './src/main.js',
	output: {
		filename: 'main.js',
        libraryTarget: 'commonjs2'
    },
	resolve: {
		extensions: [".ts", ".tsx", ".js"]
	},
	module: {
		loaders: [
			{ test: /\.tsx?$/, loader: "ts-loader" }
		]
	}
};