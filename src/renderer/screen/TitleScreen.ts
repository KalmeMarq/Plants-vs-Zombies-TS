import { Graphics, Sprite, Texture } from "pixi.js"
import App from ".."
import FontText from "../font/FontText"
import MathHelper from "../utils/MathHelper"
import GuiScreen from "./GuiScreen"
import MainMenuScreen from "./MainMenuScreen"

export default class TitleScreen extends GuiScreen {
  public titleSprite: Sprite = new Sprite()
  public logoSprite: Sprite = new Sprite()
  public loaderDirt: Sprite = new Sprite()
  public loaderGrass: Sprite = new Sprite()
  public sodRollCap: Sprite = new Sprite()

  public startText: FontText = new FontText(this.app, 'FONT_BRIANNETOD16', 'LOADING...', 0xdab821)

  private loadingComplete: boolean = false
  private progress: number = 0
  private currentBarWidth: number = 0
  private totalBarWidth: number = 314
  private static MINIMUM_LOAD_TIME: number = 300
  private progressCap: number = 0
  private progressCapCounter: number = 0
  private logoFade: number = -2

  public constructor(app: App) {
    super(app)
  }

  public init(): void {
    this.titleSprite.texture = this.app.loader.resources['IMAGE_TITLESCREEN'].texture as Texture

    this.logoSprite.texture = this.app.loader.resources['IMAGE_PVZ_LOGO'].texture as Texture
    let logoMask = new Sprite(this.app.loader.resources['IMAGE_PVZ_LOGO_MASK'].texture)
    this.logoSprite.mask = logoMask
    this.logoSprite.addChild(logoMask)
    this.logoSprite.position.set(65 * 0.675, 30 * 0.675 * this.logoFade)

    let lBarX: number = 240
    let lBarY: number = 0.9 * 600 - 17
    this.loaderDirt.texture = this.app.loader.resources['IMAGE_LOADBAR_DIRT'].texture as Texture
    this.loaderDirt.position.set((lBarX + 4), (lBarY + 18))

    this.loaderGrass.texture = this.app.loader.resources['IMAGE_LOADBAR_GRASS'].texture as Texture
    this.loaderGrass.position.set(lBarX, lBarY)

    let loaderMask = new Graphics()
    loaderMask.beginFill(0xffffff)
    loaderMask.drawRect(0, 0, this.currentBarWidth, this.loaderGrass.height)
    loaderMask.endFill()
    this.loaderGrass.mask = loaderMask
    this.loaderGrass.addChild(loaderMask)

    this.startText.setText('LOADING...')
    this.startText.pivot.set(this.startText.width / 2, 0)
    this.startText.position.set(800 / 2, 0.9 * 600 + 12)

    this.startText.on('pointerover', () => {
      this.startText.setColor(0xF9590E)
    })

    this.startText.on('pointerout', () => {
      this.startText.setColor(0xdab821)
    })

    this.startText.on('click', () => {
      this.app.soundHandler.play('buttonclick.ogg', 0.4)
      this.app.screens.pop()
      this.app.root.removeChild(this.container)

      let s = new MainMenuScreen(this.app)
      s.init()
      this.app.soundHandler.play('roll_in.ogg', 0.6)
      this.app.screens.push(s)
    })

    this.sodRollCap.texture = this.app.loader.resources['IMAGE_SODROLLCAP'].texture as Texture
    this.sodRollCap.anchor.set(0.5, 0.5)
    this.sodRollCap.position.set(240 + 11 * 0.675, ((0.9 * 600 - 17) - 3 - 35 * 1 + 35))

    this.container.addChild(this.titleSprite, this.logoSprite, this.loaderDirt, this.loaderGrass, this.startText, this.sodRollCap)
    this.app.root.addChild(this.container)
  }

  public update(): void {
    if(this.container.alpha >= 0.1) {
      ++this.progressCapCounter
      this.progressCap = this.progressCapCounter / TitleScreen.MINIMUM_LOAD_TIME
      this.progress = Math.min(this.progressCap, 1)
      this.currentBarWidth = this.progress * this.totalBarWidth;
  
      if(this.logoFade !== 1 && this.container.alpha >= 1) {
        let f = MathHelper.lerp(this.logoFade, 1, 0.1)
        this.logoFade = Math.min(f, 1)
        
        this.logoSprite.position.y = 30 * 0.675 * this.logoFade
      }

      if(!this.loadingComplete && this.progress >= 1) {
        this.loadingComplete = true;
     }
 
     if(this.currentBarWidth >= this.totalBarWidth && this.loaderGrass.mask !== null) {
       this.loaderGrass.mask = null
       this.loaderGrass.removeChildren()
 
       this.startText.setText('CLICK TO START')
       this.startText.pivot.set(this.startText.width / 2, 0)
       this.startText.position.set(800 / 2, 0.9 * 600 + 12)
       this.startText.interactive = true
       this.startText.buttonMode = true

       this.container.removeChild(this.sodRollCap)
 
     } else if(this.loaderGrass.mask !== null) {
       this.loaderGrass.removeChildAt(0)
       let loaderMask = new Graphics()
       loaderMask.beginFill(0xffffff)
       loaderMask.drawRect(0, 0, this.currentBarWidth, this.loaderGrass.height)
       loaderMask.endFill()
       this.loaderGrass.mask = loaderMask
       this.loaderGrass.addChild(loaderMask)
     }

     let rollLength: number = 0;
     var rotation: number = 0;
     var scale: number = 0;

     if(this.currentBarWidth < this.totalBarWidth) {
        rollLength = this.currentBarWidth * 0.94;
        rotation = 2 * rollLength / 180 * Math.PI
        scale = 1 - this.currentBarWidth / this.totalBarWidth / 2

        this.sodRollCap.rotation = rotation
        this.sodRollCap.scale.set(scale, scale)
        this.sodRollCap.position.set(240 + rollLength + 11 * 0.675,((0.9 * 600 - 17) - 3 - 35 * scale + 35))
      }
    }  
  }
}
