import path from 'path'
import webpack from 'webpack'

let mainConfig = {
  entry: path.resolve(__dirname, '../../src/main/index.ts'),
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
    filename: 'main.js'
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin()
  ],
  target: 'electron-main'
}

if(process.env.NODE_ENV !== 'production') {
  mainConfig.plugins.push(
    new webpack.DefinePlugin({
      '__static': `"${path.join(__dirname, '../../assets').replace(/\\/g, '\\\\')}"`
    })
  )
}

if(process.env.NODE_ENV === 'production') {
  mainConfig.plugins.push(
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    })
  )
}

module.exports = mainConfig