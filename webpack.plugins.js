const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const plugins = [new ForkTsCheckerWebpackPlugin(), new ReactRefreshWebpackPlugin()];

module.exports = plugins;
