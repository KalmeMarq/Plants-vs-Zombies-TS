import compression from 'compression'
import express, { Express } from 'express'
import * as http from 'http'
import path from 'path'
import { Compiler } from 'webpack'

const PORT: string | number = process.argv[2] === undefined ? 8000 : process.argv[2]

class Server {
  public app: Express
  public server: http.Server

  public constructor (port: string | number) {
    this.app = express()
    this.server = http.createServer(this.app)
    this.app.use(express.json())
    this.app.use(express.text())
    this.app.use(compression())
  }

  public async init (): Promise<void> {
    if (process.argv[3] === 'dev') {
      const webpackDevMiddleware = require('webpack-dev-middleware')
      const config = require('../../webpack.dev.js')
      const webpack = require('webpack')
      const compiler: Compiler = webpack(config)
      this.app.use(
        webpackDevMiddleware(compiler, {
          publicPath: config.output.publicPath
        })
      )
    } else {
      this.app.use(express.static(path.join(__dirname, '../../public')))
    }

    this.server.listen(PORT, () => {
      console.log(`[server]: Server is running at http://localhost:${PORT}`)
    })
  }
}

const server = new Server(PORT)
server.init().catch()
