import { merge } from 'webpack-merge'
import common from './webpack.common.js'
import path from 'path'

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  cache: true,
  devServer: {
    contentBase: path.resolve(__dirname, './public'),
    compress: true,
    inline: true
  }
})
