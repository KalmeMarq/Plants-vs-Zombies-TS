import { Container, Rectangle, Sprite, Texture } from "pixi.js"
import App from ".."
import { IPVZFont } from "../utils/Converters"

export default class FontText extends Container {
  public app: App
  public font: string
  public fontInfo: IPVZFont
  public text: string
  public color: number | undefined
  public fontScale: number = 1

  public constructor(app: App, font: string, text: string, color?: number) {
    super()
    this.app = app
    this.font = font
    this.text = text
    this.fontInfo = this.app.fontManager.fonts.get(font)!.info as IPVZFont
    if(typeof color === 'number') this.color = color
    this.init()
  }

  public init(): void {
    this.addCharacters()
  }

  public setText(text: string): void {
    this.text = text
    this.addCharacters()
  }

  public setColor(color: number): void {
    this.color = color
    this.addCharacters()
  }

  public addCharacters(): void {
    this.removeChildren()

    let splited = this.text.split('')
    let pos = 0

    let info = this.fontInfo.layers[this.fontInfo.layers.length - 1]
    let charList = info.layerSetCharWidths[0]
    let widthList = info.layerSetCharWidths[1]
    let rectList = info.layerSetImageMap

    let base = this.app.loader.resources[this.app.fontManager.fonts.get(this.font)!.img].texture!.baseTexture

    for(let i = 0; i < splited.length; i++) {
      let c = splited[i]
      let j = charList.findIndex(a => a === c)
      
      let rect = rectList[j]

      if(rect !== undefined) {
        let a = new Texture(base, new Rectangle(rect[0], rect[1], rect[2], rect[3]))

        let d = new Sprite(a)
        let s = new Sprite(a)

        if(/* this.font.layers[this.font.layers.length - 1].layerSetImage !== 'DwarvenTodcraft36GreenInset' */true) {
          if(typeof this.color === 'number') {
            d.tint = this.color
          }
        }

        d.mask = s
        d.addChild(s)

        d.scale.set(this.fontScale, this.fontScale)

        d.position.x = pos
        pos += widthList[j] * this.fontScale
        this.addChild(d)
      } else if(c === ' ') {
        pos += 5 * this.fontScale
      }
    }
  }
}