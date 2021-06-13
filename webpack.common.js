const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const sass = require('node-sass')

module.exports = {
  entry: path.resolve(__dirname, './src/client/index.ts'),
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
  output: {
    path: path.resolve(__dirname, './public'),
    filename: 'index.js',
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
      hash: true,
      minify: false
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, '/assets'),
          to: './assets/'
        },
        {
          from: path.join(__dirname, '/style.scss'),
          to: './style.css',
          transform (content, path) {
            const result = sass.renderSync({
              file: path
            })

            return result.css.toString()
          }
        }
      ]
    })
  ]
}
