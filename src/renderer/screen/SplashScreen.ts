import { Sprite, Texture } from "pixi.js"
import App from ".."
import GuiScreen from "./GuiScreen"
import TitleScreen from "./TitleScreen"

export default class SplashScreen extends GuiScreen {
  public logoSprite: Sprite = new Sprite()

  private loadingComplete: boolean = false
  private progressCap: number = 0
  private progressCapCounter: number = 0
  private static MINIMUM_LOAD_TIME: number = 200

  private fade: number = 1.0
  private initFade: number = 0.0

  private titleFade: number = 0.0
  private titleScreen: GuiScreen

  public constructor(app: App) {
    super(app)

    this.titleScreen = new TitleScreen(this.app)
    this.titleScreen.container.alpha
  }

  public init(): void {
    this.app.musicManager.play('music/crazydave_introtheme.mp3', 0.5)

    this.logoSprite.texture = this.app.loader.resources['IMAGE_POPCAP_LOGO'].texture as Texture
    this.logoSprite.position.set(400, 300)
    this.logoSprite.anchor.set(0.5, 0.5)
    this.logoSprite.alpha = this.initFade

    this.container.addChild(this.logoSprite)
    this.app.root.addChild(this.container)
  }

  public update(): void {
    if(this.initFade === 1) {
      ++this.progressCapCounter
      this.progressCap = this.progressCapCounter / SplashScreen.MINIMUM_LOAD_TIME
    } else {
      let f = this.initFade + 0.04
      this.initFade = Math.min(1, f)
      this.logoSprite.alpha = this.initFade
    }

    if(!this.loadingComplete && this.progressCap >= 1) {
      this.loadingComplete = true
    }

    if(this.loadingComplete) {
      let f = this.fade - 0.03
      this.fade = Math.max(0, f)
      this.logoSprite.alpha = this.fade
    }

    if(this.loadingComplete && this.fade === 0) {
      if(this.titleFade === 0) {  
        this.titleScreen.init()
        this.app.screens.unshift(this.titleScreen)
      }
      
      let f = this.titleFade + 0.1
      this.titleFade = Math.min(f, 1)
      this.titleScreen.container.alpha = this.titleFade
    }

    if(this.titleFade >= 1) {
      this.app.screens.pop()
      this.app.root.removeChild(this.container)
    }
  }
}