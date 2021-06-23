const electron = require('electron')
const path = require('path')
const { spawn } = require('child_process')
import webpack from 'webpack'
const WebpackDevServer = require('webpack-dev-server')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')

const mainConfig = require('./configs/webpack.main.config.ts')
const preloadConfig = require('./configs/webpack.preload.config.ts')
const rendererConfig = require('./configs/webpack.renderer.config.ts')

class DevRunner {
  private static electronProcess: any = null
  private static manualRestart: boolean = false
  private static hotMiddleware: any

  public static main(): void {
    Promise.all([DevRunner.startRenderer(), DevRunner.startPreload(), DevRunner.startMain()])
    .then(() => {
      DevRunner.startElectron()
    })
    .catch(err => {
      console.error(err)
    })
  }

  private static startMain(): Promise<void> {
    return new Promise((resolve, reject) => {
      mainConfig.entry = [path.join(__dirname, '../src/main/index.dev.ts')].concat(mainConfig.entry)
      mainConfig.mode = 'development'
      const compiler = webpack(mainConfig)
  
      compiler.hooks.watchRun.tapAsync('watch-run', (compilation: any, done: any) => {
        DevRunner.hotMiddleware.publish({ action: 'compiling' })
        done()
      })
  
      compiler.watch({}, (err: any, stats: any) => {
        if (err) {
          console.log(err)
          return
        }
  
        if (DevRunner.electronProcess && DevRunner.electronProcess.kill) {
          DevRunner.manualRestart = 
          process.kill(DevRunner.electronProcess.pid)
          DevRunner.electronProcess = null
          DevRunner.startElectron()
  
          setTimeout(() => {
            DevRunner.manualRestart = false
          }, 5000)
        }
  
        resolve()
      })
    })
  }

  private static startPreload(): Promise<void> {
    return new Promise((resolve, reject) => {
      preloadConfig.mode = 'development'
      const compiler = webpack(preloadConfig)

      compiler.hooks.watchRun.tapAsync('watch-run', (compilation: any, done: any) => {
        DevRunner.hotMiddleware.publish({ action: 'compiling' })
        done()
      })

      compiler.watch({}, (err: any, stats: any) => {
        if (err) {
          console.log(err)
          return
        }
  
        if (DevRunner.electronProcess && DevRunner.electronProcess.kill) {
          DevRunner.manualRestart = 
          process.kill(DevRunner.electronProcess.pid)
          DevRunner.electronProcess = null
          DevRunner.startElectron()
  
          setTimeout(() => {
            DevRunner.manualRestart = false
          }, 5000)
        }
  
        resolve()
      })
    })
  }

  private static startRenderer(): Promise<void> {
    return new Promise((resolve, reject) => {
      rendererConfig.mode = 'development'
      const compiler = webpack(rendererConfig)   

      DevRunner.hotMiddleware = webpackHotMiddleware(compiler, {
        log: false,
        heartbeat: 2500
      })
  
      compiler.hooks.compilation.tap('compilation', compilation => {
        DevRunner.hotMiddleware.publish({ action: 'reload' })
      })
  
      const server = new WebpackDevServer(
        compiler,
        {
          contentBase: path.join(__dirname, '../'),
          quiet: true,
          before (app: any, ctx: any) {
            app.use(DevRunner.hotMiddleware)
            ctx.middleware.waitUntilValid(() => {
              resolve()
            })
          }
        }
      )
  
      server.listen(9080)
    })
  }

  private static startElectron(): void {
    let args = [
      '--inspect=5858',
      path.join(__dirname, '../dist/main.js')
    ]

    if((process.env.npm_execpath as string).endsWith('yarn.js')) {
      args = args.concat(process.argv.slice(3))
    } else if((process.env.npm_execpath as string).endsWith('npm-cli.js')) {
      args = args.concat(process.argv.slice(2))
    }

    DevRunner.electronProcess = spawn(electron, args)

    DevRunner.electronProcess.on('close', () => {
      if(!DevRunner.manualRestart) process.exit()
    })
  }
}

DevRunner.main()