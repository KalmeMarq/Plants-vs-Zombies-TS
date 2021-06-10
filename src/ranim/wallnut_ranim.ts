import { Texture } from "@pixi/core";
import { Sprite } from "@pixi/sprite";
import { createBox, loader } from "..";
import ObjectRanim, { IAnimTrackInfo } from "./abstract_ranim";

export default class WallnutRanim extends ObjectRanim {
  private bodySprite: Sprite = new Sprite()

  public init() {
    this.bodySprite.texture = loader.resources['assets/reanim/Wallnut_body.png'].texture as Texture

    this.container.addChild(createBox(0, 0, 100, 100, 0x0000ff))
    this.container.addChild(this.bodySprite)

    super.init()
  }

  public update() {
    super.update()

    let bodyTicks = (this.animInfo.tracks.find(t => t.name === 'anim_face') as IAnimTrackInfo).ticks
    let btick = bodyTicks[this.frame]

    if(btick !== undefined) {
      if(btick.f) { this.frame = 0 }
      if(btick.x) { this.bodySprite.position.x = btick.x }
      if(btick.y) { this.bodySprite.position.y = btick.y }
      if(btick.sx) { this.bodySprite.scale.x = btick.sx }
      if(btick.sy) { this.bodySprite.scale.y = btick.sy }
      if(btick.kx) { this.bodySprite.pivot.x = btick.kx }
      if(btick.ky) { this.bodySprite.pivot.y = btick.ky }
    }
  }
}