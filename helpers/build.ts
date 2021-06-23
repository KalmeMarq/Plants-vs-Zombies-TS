const del = require('del')
import webpack from 'webpack'
const Multispinner = require('multispinner')

const mainConfig = require('./configs/webpack.main.config.ts')
const preloadConfig = require('./configs/webpack.preload.config.ts')
const rendererConfig = require('./configs/webpack.renderer.config.ts')
const webConfig = require('./configs/webpack.web.config.ts')

class Builder {
  static main() {
    if(process.env.BUILD_TARGET === 'clean') Builder.clean()
    else if(process.env.BUILD_TARGET === 'web') Builder.web()
    else Builder.build()
  }
  
  static clean() {
    del.sync(['build/*', '!build/icons', '!build/icons/icon.*'])
    console.log(`\nDONE\n`)
    process.exit()
  }

  static build () {
    del.sync(['dist/electron/*', '!.gitkeep'])
  
    const tasks = ['main', 'renderer']
    const m = new Multispinner(tasks, {
      preText: 'building',
      postText: 'process'
    })
  
    let results = ''
  
    m.on('success', () => {
      process.stdout.write('\x1B[2J\x1B[0f')
      console.log(`\n\n${results}`)
      console.log(`OK take it away electron-builder\n`)
      process.exit()
    })
  
    Builder.pack(mainConfig).then(result => {
      results += result + '\n\n'
      m.success('main')
    }).catch(err => {
      m.error('main')
      console.log(`\n  ERROR failed to build main process`)
      console.error(`\n${err}\n`)
      process.exit(1)
    })

    Builder.pack(preloadConfig).then(result => {
      results += result + '\n\n'
      m.success('preload')
    }).catch(err => {
      m.error('preload')
      console.log(`\n  ERROR failed to build preload process`)
      console.error(`\n${err}\n`)
      process.exit(1)
    })
  
    Builder.pack(rendererConfig).then(result => {
      results += result + '\n\n'
      m.success('renderer')
    }).catch(err => {
      m.error('renderer')
      console.log(`\n  ERROR failed to build renderer process`)
      console.error(`\n${err}\n`)
      process.exit(1)
    })
  }

  static web() {
    del.sync(['dist/web/*', '!.gitkeep'])
    webConfig.mode = 'production'
    webpack(webConfig, (err: any, stats: any) => {
      if (err || stats.hasErrors()) console.log(err)
  
      console.log(stats.toString({
        chunks: false,
        colors: true
      }))
  
      process.exit()
    })
  }

  static pack(config: any) {
    return new Promise((resolve, reject) => {
      config.mode = 'production'
      webpack(config, (err: any, stats: any) => {
        if (err) reject(err.stack || err)
        else if (stats.hasErrors()) {
          let err = ''
  
          stats.toString({
            chunks: false,
            colors: true
          })
          .split(/\r?\n/)
          .forEach((line: any) => {
            err += `    ${line}\n`
          })
  
          reject(err)
        } else {
          resolve(stats.toString({
            chunks: false,
            colors: true
          }))
        }
      })
    })
  }
}

Builder.main()