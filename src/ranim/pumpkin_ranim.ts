import * as PIXI from 'pixi.js'
import { createBox, loader } from '..'
import ObjectRanim, { IAnimTrackInfo } from './abstract_ranim'

export default class PumpkinRanim extends ObjectRanim {
  private backSprite: PIXI.Sprite = new PIXI.Sprite()
  private frontSprite: PIXI.Sprite = new PIXI.Sprite()

  public init() {
    this.backSprite = new PIXI.Sprite(loader.resources['assets/reanim/Pumpkin_back.png'].texture)
    this.frontSprite = new PIXI.Sprite(loader.resources['assets/reanim/Pumpkin_front.png'].texture)

    this.container.addChild(createBox(0, 0, 120, 80, 0x0000ff))
    this.container.addChild(this.backSprite, this.frontSprite)

    super.init()
  }

  public update() {
    super.update()

    let ppBackTicks = (this.animInfo.tracks.find(t => t.name === 'Pumpkin_back') as IAnimTrackInfo).ticks
    let ppFrontTicks = (this.animInfo.tracks.find(t => t.name === 'Pumpkin_front') as IAnimTrackInfo).ticks
    let btick = ppBackTicks[this.frame]
    let ftick = ppFrontTicks[this.frame]

    if(btick !== undefined) {
      if(btick.x) { this.backSprite.position.x = btick.x}
      if(btick.y) { this.backSprite.position.y = btick.y }
      if(btick.sx) { this.backSprite.scale.x = btick.sx }
      if(btick.sy) { this.backSprite.scale.y = btick.sy }
    }

    if(ftick !== undefined) {
      if(ftick.x) { this.frontSprite.position.x = ftick.x }
      if(ftick.y) { this.frontSprite.position.y = ftick.y }
      if(ftick.sx) { this.frontSprite.scale.x = ftick.sx }
      if(ftick.sy) { this.frontSprite.scale.y = ftick.sy }
    }
  }
}