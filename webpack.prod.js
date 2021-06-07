import { merge } from 'webpack-merge'
import common from './webpack.common.js'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin()
  ]
})
