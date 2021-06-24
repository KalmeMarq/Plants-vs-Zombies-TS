import { ipcRenderer } from 'electron'
import * as PIXI from 'pixi.js'
import { Container } from 'pixi.js'
import FontManager from './font/FontManager'
import GuiScreen from './screen/GuiScreen'
import SplashScreen from './screen/SplashScreen'
import MusicManager from './sound/MusicManager'
import SoundHandler from './sound/SoundHandler'
import Converters from './utils/Converters'

export default class App {
  public app: PIXI.Application
  public root: Container
  public loader: PIXI.Loader
  public screens: GuiScreen[] = []
  public fontManager: FontManager 
  public soundHandler: SoundHandler
  public musicManager: MusicManager

  public running: boolean = true
  public windowFocused: boolean = false
  public fullscreen = false

  public constructor() {
    this.app = new PIXI.Application({
      width: 800,
      height: 600,
      backgroundColor: 0x000000
    })

    this.root = new Container()
    this.app.stage.addChild(this.root)

    this.app.renderer.plugins.interaction.cursorStyles.default = 'url("./assets/cursor.png"), default'
    this.app.renderer.plugins.interaction.cursorStyles.pointer = 'url("./assets/cursor_pointer.png"), pointer'
    this.app.renderer.plugins.interaction.cursorStyles.grab = 'url("./assets/cursor_grab.png"), default'
    this.app.renderer.plugins.interaction.cursorStyles.grabbing = 'url("./assets/cursor_grab.png"), default'

    this.loader = new PIXI.Loader()

    this.soundHandler = new SoundHandler(this)
    this.musicManager = new MusicManager(this)

    ipcRenderer.on('pvzts:isMoving', () => {
      this.running = false
      this.musicManager.pause()
    })

    ipcRenderer.on('pvzts:wasMoving', () => {
      this.running = true
      this.musicManager.resume()
    })

    ipcRenderer.on('pvzts:windowFocused', (e, args) => {
      this.windowFocused = args === 'true' ? true : false

      if(this.windowFocused) {
        this.musicManager.resume()
      } else {
        this.musicManager.pause()
      }
    })

    window.addEventListener('keydown', (e) => {
      if(e.key === 'F11') {
        this.fullscreen = !this.fullscreen
        ipcRenderer.send('pvzts:fullscreen', this.fullscreen ? 'true' : 'false')
      }
    })

    this.fontManager = new FontManager()
  }

  public init(): void {
    document.getElementById('root')!.appendChild(this.app.view)
    this.app.view.style.height = '100vh'

    this.loader.add([{ name: 'IMAGE_TITLESCREEN', url: './assets/images/titlescreen.jpg'},
    { name: 'IMAGE_PVZ_LOGO', url: './assets/images/PvZ_Logo.jpg'},
    { name: 'IMAGE_PVZ_LOGO_MASK', url: './assets/images/PvZ_Logo_.png'},
    { name: 'IMAGE_LOADBAR_DIRT', url: './assets/images/LoadBar_dirt.png'},
    { name: 'IMAGE_LOADBAR_GRASS', url: './assets/images/LoadBar_grass.png'},
    { name: 'IMAGE_POPCAP_LOGO', url: './assets/images/PopCap_Logo.jpg'},
    { name: 'IMAGE_SELECTORSCREEN_BG', url: './assets/reanim/SelectorScreen_BG.jpg'},
    { name: 'IMAGE_SELECTORSCREEN_BG_LEFT', url: './assets/reanim/SelectorScreen_BG_Left.jpg'},
    { name: 'IMAGE_SELECTORSCREEN_BG_LEFT_MASK', url: './assets/reanim/SelectorScreen_BG_Left_.png'},
    { name: 'IMAGE_SELECTORSCREEN_BG_CENTER', url: './assets/reanim/SelectorScreen_BG_Center.jpg'},
    { name: 'IMAGE_SELECTORSCREEN_BG_CENTER_MASK', url: './assets/reanim/SelectorScreen_BG_Center_.png'},
    { name: 'IMAGE_SELECTORSCREEN_BG_RIGHT', url: './assets/reanim/SelectorScreen_BG_Right.jpg'},
    { name: 'IMAGE_SELECTORSCREEN_BG_RIGHT_MASK', url: './assets/reanim/SelectorScreen_BG_Right_.png'},
    { name: 'FONT_IMAGE_BRIANNETOD16', url: './assets/data/_BrianneTod16.png' },
    { name: 'FONT_BRIANNETOD16', url: './assets/data/BrianneTod16.txt' },
    { name: 'REANIM_SODROLL', url: './assets/reanim/SodRoll.reanim' },
    { name: 'IMAGE_SODROLLCAP', url: './assets/reanim/SodRollCap.png' },
    { name: 'IMAGE_SELECTOR_STARTADVENTURE_BUTTON', url: './assets/reanim/SelectorScreen_StartAdventure_Button1.png' },
    { name: 'IMAGE_SELECTOR_STARTADVENTURE_BUTTON_HIGHLIGHT', url: './assets/reanim/SelectorScreen_StartAdventure_Highlight.png' },
    { name: 'IMAGE_SELECTOR_STARTADVENTURE_BUTTON_SHADOW', url: './assets/reanim/SelectorScreen_Shadow_Adventure.png' },
    { name: 'IMAGE_SELECTOR_MINIGAMES_BUTTON', url: './assets/reanim/SelectorScreen_Survival_button.png' },
    { name: 'IMAGE_SELECTOR_MINIGAMES_BUTTON_HIGHLIGHT', url: './assets/reanim/SelectorScreen_Survival_highlight.png' },
    { name: 'IMAGE_SELECTOR_MINIGAMES_BUTTON_SHADOW', url: './assets/reanim/SelectorScreen_Shadow_Survival.png' },
    { name: 'IMAGE_TRIAL_BG', url: './assets/reanim/trial.jpg' }
  ]).load(async() => {
      this.fontManager.addFont('FONT_BRIANNETOD16', 'FONT_IMAGE_BRIANNETOD16', Converters.fontInfo(this.loader.resources['FONT_BRIANNETOD16'].data))
      let s = new SplashScreen(this)
      s.init()
      this.screens.push(s)
    })

    this.update()
  }

  public update(): void {
    const animate = () => {
      requestAnimationFrame(animate)
      this.app.renderer.render(this.root)
    }

    this.app.ticker.add(() => {
      if(this.running) {
        for(let i = 0; i < this.screens.length; i++) {
          this.screens[i].update()
        }
      }
    })
  }
}

let pvz = new App()
pvz.init()