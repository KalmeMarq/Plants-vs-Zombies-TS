import path from 'path'
import webpack from 'webpack'

let preloadConfig = {
  entry: path.resolve(__dirname, '../../src/preload/index.ts'),
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
  node: {
    __dirname: process.env.NODE_ENV !== 'production',
    __filename: process.env.NODE_ENV !== 'production'
  },
  output: {
    path: path.resolve(__dirname, '../../dist'),
    filename: 'preload.js'
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin()
  ]
}

if(process.env.NODE_ENV === 'production') {
  preloadConfig.plugins.push(
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    })
  )
}

module.exports = preloadConfig