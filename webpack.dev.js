const path = require('path');
const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
  mode: "development",
  devtool: "source-map",
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/client/public/index.html'),
      filename: 'index.html',
      inject: 'body'
    })
  ],
  devServer: {
    historyApiFallback: true,
    compress: true,
    publicPath: "/",
    port: 8089
  },
});