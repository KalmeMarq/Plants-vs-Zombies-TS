// Modules to control application life and create native browser window
import { app, BrowserWindow, ipcMain } from 'electron'
import * as fs from 'fs'
import path from 'path'
import DiscordPresence from './DiscordPresence'

DiscordPresence.start()

class Main {
  public static winURL = /* true ?  */`http://localhost:9080`/*  : `file://${__dirname}/index.html` */

  public static main(): void {
    app.on('ready', (): void => {
      let window = Main.createWindow()
    
      ipcMain.on('pvzts:fullscreen', (e, args) => {
        window.setFullScreen(`${args}` === 'true' ? true : false)
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

  public static createWindow(): BrowserWindow {
    const mainWindow: BrowserWindow = new BrowserWindow({
      width: 800,
      height: 600,
      resizable: false,
      title: 'Plants vs. Zombies TS',
      icon: './dist/assets/icon-16x16.ico',
      webPreferences: {
        nodeIntegration: true,
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: false
      }
    })
  
    if(process.env.NODE_ENV === 'development') {
      mainWindow.loadURL(Main.winURL)
    } else {
      mainWindow.loadFile('./dist/index.html')
    }
    mainWindow.removeMenu()
  
    return mainWindow
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
}

Main.main()