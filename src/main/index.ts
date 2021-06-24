// Modules to control application life and create native browser window
import { app, BrowserWindow, ipcMain } from 'electron'
import * as fs from 'fs'
import path from 'path'
import ISettings from '../common/ISettings'
import Paths from '../common/Paths'
import DiscordPresence from './DiscordPresence'

DiscordPresence.start()

class Main {
  public static settings: ISettings = {
    fullscreen: false,
    always_on_top: false,
    sound: 1.0,
    music: 1.0,
    disable_hardware_acceleration: false
  }
  public static winURL = /* true ?  */`http://localhost:9080`/*  : `file://${__dirname}/index.html` */
  public static mainWindow: BrowserWindow
  public static loadingWindow: BrowserWindow | undefined
  public static firstMove: boolean = true
  public static secondMove: boolean = true

  public static main(): void {
    try {
      this.settings = JSON.parse(
        fs.readFileSync(path.join(Paths.DATAPATH(), 'settings.json')).toString()
      )
    } catch (e) {}

    app.on('ready', (): void => {
      Main.createWindow()
      Main.createLoadingWindow()

      if(this.settings.disable_hardware_acceleration) {
        app.disableHardwareAcceleration()
      }

      ipcMain.on('pvzts:fullscreen', (e, args) => {
        this.mainWindow.setFullScreen(`${args}` === 'true' ? true : false)
      })
    
      ipcMain.on('pvzts:saveUsers', (e, args) => {
        Main.writeFile(`userdata\\${args.filename}`, args.data)
      })
    
      ipcMain.on('pvzts:saveOptions', (e, args) => {
        Main.writeFile(args.filename, args.data)
      })
    })
    
    app.on('activate', function () {
      if(BrowserWindow.getAllWindows().length === 0) {
        Main.createWindow()
      }
    })
    
    app.on('window-all-closed', function () {
      if(process.platform !== 'darwin') {
        app.quit()
      }
    })
  }

  public static createWindow(): void {
    this.mainWindow = new BrowserWindow({
      width: 800,
      height: 625,
      title: 'Plants vs. Zombies TS',
      icon: './dist/assets/icon-16x16.ico',
      center: true,
      backgroundColor: '#000000',
      resizable: false,
      show: false,
      fullscreen: this.settings.fullscreen,
      webPreferences: {
        nodeIntegration: true,
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: false
      }
    })

    this.mainWindow.webContents.on('did-finish-load', () => {
      if(this.loadingWindow) {
        this.loadingWindow.close()
        this.mainWindow.show()
      }

      this.mainWindow.on('move', () => {
        this.mainWindow.webContents.send('pvzts:isMoving', '')
      })
  
      this.mainWindow.on('moved', () => {
        this.mainWindow.webContents.send('pvzts:wasMoving', '')
      })

      this.mainWindow.on('blur', () => {
        this.mainWindow.webContents.send('pvzts:windowFocused', 'false')
      })

      this.mainWindow.on('focus', () => {
        this.mainWindow.webContents.send('pvzts:windowFocused', 'true')
      })
    })
  
    if(process.env.NODE_ENV === 'development') {
      this.mainWindow.loadURL(Main.winURL)
    } else {
      this.mainWindow.loadFile('./dist/index.html')
    }

    this.mainWindow.removeMenu()
  }

  public static appPath(): string {
    switch(process.platform) {
      case 'darwin': {
        return path.join(process.env.HOME as string, 'Library', 'Application Support')
      }
      case 'win32': {
        return process.env.APPDATA as string
      }
      case 'linux': {
        return process.env.HOME as string
      }
    }
  
    throw new Error('Save path not found >:(') 
  }

  public static writeFile(filename: string, data: any): void {
    const fullPath = path.join(Main.appPath(), "\\.plants_vs_zombies_ts\\", filename)
    
    try {
      fs.mkdirSync(path.join(Main.appPath(), "\\.plants_vs_zombies_ts"))
      Main.writeFile(filename, data)
    } catch(e) {
      fs.writeFileSync(fullPath, data)
    }
  }

  public static createLoadingWindow(): void {
    this.loadingWindow = new BrowserWindow({
      height: 400,
      useContentSize: true,
      width: 400,
      titleBarStyle: 'hidden',
      frame: process.platform === 'darwin',
      resizable: false,
      backgroundColor: '#00000000',
      webPreferences: {
        nodeIntegration: true,
      },
    })
  
    this.loadingWindow.loadFile(`./dist/assets/loading.html`)
  
    this.loadingWindow.on('closed', () => {
      this.loadingWindow = undefined
    })
  
    this.loadingWindow.webContents.on('did-finish-load', () => {
      this.loadingWindow?.show()
    })
  }
}

Main.main()