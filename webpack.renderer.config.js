const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');

rules.push({
	test: /\.s[ac]ss$/i,
	use: [
		// Creates `style` nodes from JS strings
		'style-loader',
		// Translates CSS into CommonJS
		'css-loader',
		// Needed package for resolving relative paths in url()
		// needs to be before sass-loader in loading chain
		// more info on https://github.com/webpack-contrib/sass-loader#problems-with-url
		'resolve-url-loader',
		// Compiles Sass to CSS
		'sass-loader',
	],
});

module.exports = {
	module: {
		rules,
	},
	target: 'electron-renderer',
	node: {
		__dirname: false,
	},
	plugins: plugins,
	resolve: {
		extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
		fallback: { path: require.resolve('path-browserify') },
	},
};
