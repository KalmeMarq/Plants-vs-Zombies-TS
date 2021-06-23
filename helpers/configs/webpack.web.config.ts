import CopyWebpackPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'
import webpack from 'webpack'

let webConfig: any = {
  devtool: '#cheap-module-eval-source-map',
  entry: path.join(__dirname, '../../src/renderer/index.js'),
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/web/index.html',
      hash: true,
      minify: false
    })
  ],
  output: {
    filename: 'web.js',
    path: path.join(__dirname, '../../dist/web')
  },
  target: 'web'
}

if (process.env.NODE_ENV === 'production') {
  webConfig.devtool = ''

  webConfig.plugins.push(
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, '../../assets'),
          to: path.join(__dirname, '../../dist/web/assets')
        }/* ,
        {
          from: path.join(__dirname, '../../src/web/style.scss'),
          to: './style.css',
          transform (content, path) {
            const result = sass.renderSync({
              file: path
            })
  
            return result.css.toString()
          }
        } */
      ]
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  )
}

module.exports = webConfig