import CopyWebpackPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'
import webpack from 'webpack'

let rendererConfig = {
  entry: path.resolve(__dirname, '../../src/renderer/index.ts'),
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
		__filename: process.env.NODE_ENV !== 'production',
	},
  output: {
    path: path.resolve(__dirname, '../../dist'),
    filename: 'renderer.js',
    publicPath: './'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/web/index.html',
      hash: true,
      minify: false
    }),
    new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin()
  ],
  target: 'electron-renderer'
}

if(process.env.NODE_ENV !== 'production') {
	rendererConfig.plugins.push(
		new webpack.DefinePlugin({
			__static: `"${path
				.join(__dirname, '../../assets')
				.replace(/\\/g, '\\\\')}"`,
		})
	)
}

if(process.env.NODE_ENV === 'production') {
	rendererConfig.plugins.push(
		new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, '../../assets'),
          to: path.join(__dirname, '../../dist/assets')
        }/* ,
        {
          from: path.join(__dirname, '../../src/web/style.scss'),
          to: './style.css',
          transform (content: any, path: any) {
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
			minimize: true,
		})
	)
}

module.exports = rendererConfig