import { } from '@pixi/filter-color-overlay';
import HitAreaShapes from 'hitarea-shapes';
import { Sprite, Texture } from "pixi.js";
import App from "..";
import MiniGamesHitArea from '../data/hitareas/MiniGamesHitArea';
import StartAdventureHitArea from '../data/hitareas/StartAdventureHitArea';
import GuiScreen from "./GuiScreen";

class GraveButton extends Sprite {
  public shadow: Sprite = new Sprite()
  
  public constructor(bgPos: [number, number], shadowPos: [number, number]) {
    super()

    this.shadow.position.set(shadowPos[0], shadowPos[1])
    this.addChild(this.shadow)
  }
}

export default class MainMenuScreen extends GuiScreen {
  public bg: Sprite = new Sprite()
  public bgLeft: Sprite = new Sprite()
  public bgCenter: Sprite = new Sprite()
  public bgRight: Sprite = new Sprite()

  public startAdventure: Sprite = new Sprite()
  public miniGames: Sprite = new Sprite()

  public initOffset: number = 60

  public constructor(app: App) {
    super(app)
  }

  public init(): void {
    this.bg.texture = this.app.loader.resources['IMAGE_SELECTORSCREEN_BG'].texture as Texture
    this.bgLeft.texture = this.app.loader.resources['IMAGE_SELECTORSCREEN_BG_LEFT'].texture as Texture
    this.bgCenter.texture = this.app.loader.resources['IMAGE_SELECTORSCREEN_BG_CENTER'].texture as Texture
    this.bgRight.texture = this.app.loader.resources['IMAGE_SELECTORSCREEN_BG_RIGHT'].texture as Texture
    let bgLeftMask = new Sprite(this.app.loader.resources['IMAGE_SELECTORSCREEN_BG_LEFT_MASK'].texture)
    let bgCenterMask = new Sprite(this.app.loader.resources['IMAGE_SELECTORSCREEN_BG_CENTER_MASK'].texture)
    let bgRightMask = new Sprite(this.app.loader.resources['IMAGE_SELECTORSCREEN_BG_RIGHT_MASK'].texture)
    this.bgLeft.mask = bgLeftMask
    this.bgLeft.addChild(bgLeftMask)
    this.bgCenter.mask = bgCenterMask
    this.bgCenter.addChild(bgCenterMask)
    this.bgRight.mask = bgRightMask
    this.bgRight.addChild(bgRightMask)

    this.bg.scale.set(8, 8)

    this.bgLeft.position.y = -80 + this.initOffset
    this.bgCenter.position.x = 80
    this.bgCenter.position.y = 250
    this.bgRight.position.set(800 - this.bgRight.width, 600 - this.bgRight.height + this.initOffset * 2)

    this.container.addChild(this.bg, this.bgCenter, this.bgLeft, this.bgRight)

    // Start Adventure
    let sADT = this.app.loader.resources['IMAGE_SELECTOR_STARTADVENTURE_BUTTON'].texture as Texture
    let sAHT = this.app.loader.resources['IMAGE_SELECTOR_STARTADVENTURE_BUTTON_HIGHLIGHT'].texture as Texture
    this.startAdventure.texture = sADT
    let sAS = new Sprite(this.app.loader.resources['IMAGE_SELECTOR_STARTADVENTURE_BUTTON_SHADOW'].texture)
    this.startAdventure.position.set(405.0, 65.0)
    sAS.position.set(398.0, 66.0)
    this.startAdventure.interactive = true
    this.startAdventure.buttonMode = true

    let isHovered = false
    let isPressed = false

    this.startAdventure.hitArea = new HitAreaShapes(StartAdventureHitArea);

    this.startAdventure.on('pointerover', () => {
      isHovered = true
      this.startAdventure.texture = sAHT
      this.app.soundHandler.play('gravebutton.ogg', 0.4)
    })

    this.startAdventure.on('pointerdown', () => {
      isPressed = true
      this.startAdventure.position.x += 1
      this.startAdventure.position.y += 1
      sAS.position.x += 1
      sAS.position.y += 1
    })

    this.startAdventure.on('pointerup', () => {
      if(isPressed) {
        isPressed = false
        this.startAdventure.position.x -= 1
        this.startAdventure.position.y -= 1
        sAS.position.x -= 1
        sAS.position.y -= 1
      }
    })

    this.startAdventure.on('pointerupoutside', () => {
      if(isPressed) {
        isPressed = false
        this.startAdventure.position.x -= 1
        this.startAdventure.position.y -= 1
        sAS.position.x -= 1
        sAS.position.y -= 1
      }
    })

    this.startAdventure.on('pointerout', () => {
      if(isHovered) {
        isHovered = false
        this.startAdventure.texture = sADT
      }
    })

    // Minigames
    let sMDT = this.app.loader.resources['IMAGE_SELECTOR_MINIGAMES_BUTTON'].texture as Texture
    this.miniGames.texture = sMDT

    this.miniGames.hitArea = new HitAreaShapes(MiniGamesHitArea);
 
    this.miniGames.tint = 0x777777
    let sMHT = this.app.loader.resources['IMAGE_SELECTOR_MINIGAMES_BUTTON_HIGHLIGHT'].texture as Texture
    let sMS = new Sprite(this.app.loader.resources['IMAGE_SELECTOR_MINIGAMES_BUTTON_SHADOW'].texture)
    sMS.position.set(407.0, 177.2)
    this.miniGames.position.set(406.0, 173.1)

    this.miniGames.interactive = true
    this.miniGames.buttonMode = true

    this.miniGames.on('pointerover', () => {
      isHovered = true
      this.miniGames.texture = sMHT
      this.app.soundHandler.play('gravebutton.ogg', 0.4)
    })

    this.miniGames.on('pointerout', () => {
      if(isHovered) {
        isHovered = false
        this.miniGames.texture = sMDT
      }
    })

    this.container.addChild(sAS, this.startAdventure, sMS, this.miniGames)
    this.app.root.addChild(this.container)
  }

  public update(): void {
    if(this.initOffset > 0) {
      this.initOffset = Math.max(0, this.initOffset - 5)

      this.bgLeft.position.y = -80 + this.initOffset
      this.bgRight.position.set(800 - this.bgRight.width, 600 - this.bgRight.height + this.initOffset * 2)
    }
  }
}