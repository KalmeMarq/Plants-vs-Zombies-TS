import * as PIXI from 'pixi.js'
import { BaseTexture, LoaderResource, SimplePlane } from 'pixi.js'
import PumpkinRanim from './ranim/pumpkin_ranim'
import WallnutRanim from './ranim/wallnut_ranim'
import { convertFontInfo, convertReanim, convertResourcesFile, convertTextsFile } from './util/converters'

const options: PIXI.IApplicationOptions = {
  width: 800,
  height: 600,
  backgroundColor: 0x000000
}

const root = document.getElementById('root') as HTMLDivElement
export const app: PIXI.Application = new PIXI.Application(options)
export const loader: PIXI.Loader = new PIXI.Loader('./')

app.view.style.width = '800px'
app.view.style.height = '600px'
root.appendChild(app.view)
// app.stage.sortableChildren = true
app.renderer.plugins.interaction.cursorStyles.default = 'url("./assets/cursor.png"), default'
app.renderer.plugins.interaction.cursorStyles.pointer = 'url("./assets/cursor_pointer.png"), pointer'

class Pumpkin {
  damage = 0
  container: PIXI.Container
  backSprite: PIXI.Sprite = new PIXI.Sprite()
  frontSprite: PIXI.Sprite = new PIXI.Sprite()
  damage1Sprite: PIXI.Sprite = new PIXI.Sprite()
  damage2Sprite: PIXI.Sprite = new PIXI.Sprite()
  damage3Sprite: PIXI.Sprite = new PIXI.Sprite()
  baseWidth: number = 0
  baseHeight: number = 0
  delta: number = -1
  scaleW: number = 1
  scaleH: number = 1

  constructor() {
    this.container = new PIXI.Container()
  }

  init() {
    this.backSprite = new PIXI.Sprite(loader.resources['assets/reanim/Pumpkin_back.png'].texture)
    this.frontSprite = new PIXI.Sprite(loader.resources['assets/reanim/Pumpkin_front.png'].texture)
    this.damage1Sprite = new PIXI.Sprite(loader.resources['assets/reanim/pumpkin_damage1.png'].texture)
    this.damage2Sprite = new PIXI.Sprite(loader.resources['assets/reanim/Pumpkin_damage2.png'].texture)
    this.damage3Sprite = new PIXI.Sprite(loader.resources['assets/reanim/Pumpkin_damage3.png'].texture)
  
    this.backSprite.anchor.set(0.5, 1)
    this.frontSprite.anchor.set(0.5, 1)
    this.damage1Sprite.anchor.set(0.5, 1)
    this.damage2Sprite.anchor.set(0.5, 1)
    this.damage3Sprite.anchor.set(0.5, 1)

    this.baseWidth = this.backSprite.width
    this.baseHeight = this.backSprite.height

    this.backSprite.position.set(this.baseWidth / 2, this.baseHeight)
    this.frontSprite.position.set(this.baseWidth / 2, this.baseHeight)
    this.damage1Sprite.position.set(this.baseWidth / 2, this.baseHeight)
    this.damage2Sprite.position.set(this.baseWidth / 2, this.baseHeight)
    this.damage3Sprite.position.set(this.baseWidth / 2, this.baseHeight)

    this.damage1Sprite.visible = false
    this.damage2Sprite.visible = false
    this.damage3Sprite.visible = false

    let g = new PIXI.Graphics()
    g.lineStyle({
      width: 1,
      color: 0x0000ff
    })

    g.moveTo(1, 1)
    g.lineTo(this.baseWidth - 1, 1)
    g.lineTo(this.baseWidth - 1, this.baseHeight - 1)
    g.lineTo(1, this.baseHeight - 1)
    g.lineTo(1, 1)

    this.container.addChild(g)
    this.container.addChild(this.backSprite, this.frontSprite, this.damage1Sprite, this.damage1Sprite, this.damage2Sprite, this.damage3Sprite)
  }

  update() {
    this.scaleH += 0.002 * this.delta
    this.scaleW += 0.001 * -this.delta 

    if(this.scaleH < 0.95) {
      this.delta = 1
    } else if(this.scaleH >= 1.05) {
      this.delta = -1
    }

    this.backSprite.scale.set(this.scaleW, this.scaleH)
    this.frontSprite.scale.set(this.scaleW, this.scaleH)
    this.damage1Sprite.scale.set(this.scaleW, this.scaleH)
    this.damage2Sprite.scale.set(this.scaleW, this.scaleH)
    this.damage3Sprite.scale.set(this.scaleW, this.scaleH)
  }

  add() {
    app.stage.addChild(this.container)
  }

  remove() {
    app.stage.removeChild(this.container)
  }
}

let dSRanime: any = {}
let ppRanime: any = {}

export function createBox(x: number, y: number, width: number, height: number, color?: number) {
  let g = new PIXI.Graphics()
  g.lineStyle({
    width: x + 1,
    color: color
  })

  g.moveTo(x + 1, y + 1)
  g.lineTo(width - 1 + x, 1 + y)
  g.lineTo(width - 1 + x, height - 1 + y)
  g.lineTo(1 + x, height - 1 + y)
  g.lineTo(1 + x, 1 + y)

  return g
}

class DoomShroom {
  container: PIXI.Container
  shroom: PIXI.Container = new PIXI.Container()
  head1Sprite: PIXI.Sprite = new PIXI.Sprite()
  head2Sprite: PIXI.Sprite = new PIXI.Sprite()
  head3Sprite: PIXI.Sprite = new PIXI.Sprite()
  sleepHeadSprite: PIXI.Sprite = new PIXI.Sprite()
  bodySprite: PIXI.Sprite = new PIXI.Sprite()
  baseWidth: number = 0
  baseHeight: number = 0
  delta: number = -1
  scaleW: number = 1
  scaleH: number = 1

  constructor() {
    this.container = new PIXI.Container()
  }

  init() {
    this.bodySprite.texture = loader.resources['assets/reanim/DoomShroom_body.png'].texture as PIXI.Texture
    this.head1Sprite.texture = loader.resources['assets/reanim/DoomShroom_head1.png'].texture as PIXI.Texture
  
    this.bodySprite.position.set(this.head1Sprite.width / 2 - this.bodySprite.width / 2, this.head1Sprite.height - 8)

    this.baseWidth = this.head1Sprite.width
    this.baseHeight = this.head1Sprite.height + this.bodySprite.height - 8

    let g = new PIXI.Graphics()
    g.lineStyle({
      width: 1,
      color: 0x0000ff
    })

    g.moveTo(1, 1)
    g.lineTo(this.baseWidth - 1, 1)
    g.lineTo(this.baseWidth - 1, this.baseHeight - 1)
    g.lineTo(1, this.baseHeight - 1)
    g.lineTo(1, 1)
    this.container.addChild(g)

    this.shroom.addChild(this.bodySprite, this.head1Sprite)
    this.shroom.pivot.set(this.baseWidth / 2, this.baseHeight)
    this.shroom.position.x = this.baseWidth / 2
    this.shroom.position.y = this.baseHeight

    this.container.addChild(this.shroom)
  }

  update() {
    this.scaleH += 0.002 * this.delta
    this.scaleW += 0.00075 * -this.delta

    if(this.scaleH < 0.95) {
      this.delta = 1
    } else if(this.scaleH >= 1.05) {
      this.delta = -1
    }

    this.shroom.scale.set(this.scaleW, this.scaleH)
  }

  add() {
    app.stage.addChild(this.container)
  }

  remove() {
    app.stage.removeChild(this.container)
  }
}

class Sunflower {
  container: PIXI.Container
  headSprite: PIXI.Sprite = new PIXI.Sprite()
  stalkSprite: PIXI.Sprite = new PIXI.Sprite()
  
  bottomPetals = new PIXI.Sprite()
  topPetals = new PIXI.Sprite()
  leftPetal1 = new PIXI.Sprite()
  leftPetal2 = new PIXI.Sprite()
  leftPetal3 = new PIXI.Sprite()
  leftPetal4 = new PIXI.Sprite()
  leftPetal5 = new PIXI.Sprite()
  leftPetal6 = new PIXI.Sprite()
  leftPetal7 = new PIXI.Sprite()
  leftPetal8 = new PIXI.Sprite()
  rightPetal1 = new PIXI.Sprite()
  rightPetal2 = new PIXI.Sprite()
  rightPetal3 = new PIXI.Sprite()
  rightPetal4 = new PIXI.Sprite()
  rightPetal5 = new PIXI.Sprite()
  rightPetal6 = new PIXI.Sprite()
  rightPetal7 = new PIXI.Sprite()
  rightPetal8 = new PIXI.Sprite()
  rightPetal9 = new PIXI.Sprite()

  baseWidth: number = 0
  baseHeight: number = 0

  constructor() {
    this.container = new PIXI.Container()
  }

  init() {
    this.headSprite.texture = loader.resources['assets/reanim/SunFlower_head.png'].texture as PIXI.Texture
    this.stalkSprite.texture = loader.resources['assets/reanim/PeaShooter_stalk_bottom.png'].texture as PIXI.Texture
    
    this.leftPetal1.texture = loader.resources['assets/reanim/SunFlower_leftpetal1.png'].texture as PIXI.Texture
    this.leftPetal2.texture = loader.resources['assets/reanim/SunFlower_leftpetal2.png'].texture as PIXI.Texture
    this.leftPetal3.texture = loader.resources['assets/reanim/SunFlower_leftpetal3.png'].texture as PIXI.Texture
    this.leftPetal4.texture = loader.resources['assets/reanim/SunFlower_leftpetal4.png'].texture as PIXI.Texture
    this.leftPetal5.texture = loader.resources['assets/reanim/SunFlower_leftpetal5.png'].texture as PIXI.Texture
    this.leftPetal6.texture = loader.resources['assets/reanim/SunFlower_leftpetal6.png'].texture as PIXI.Texture
    this.leftPetal7.texture = loader.resources['assets/reanim/SunFlower_leftpetal7.png'].texture as PIXI.Texture
    this.leftPetal8.texture = loader.resources['assets/reanim/SunFlower_leftpetal8.png'].texture as PIXI.Texture
    this.rightPetal1.texture = loader.resources['assets/reanim/SunFlower_rightpetal1.png'].texture as PIXI.Texture
    this.rightPetal2.texture = loader.resources['assets/reanim/SunFlower_rightpetal2.png'].texture as PIXI.Texture
    this.rightPetal3.texture = loader.resources['assets/reanim/SunFlower_rightpetal3.png'].texture as PIXI.Texture
    this.rightPetal4.texture = loader.resources['assets/reanim/SunFlower_rightpetal4.png'].texture as PIXI.Texture
    this.rightPetal5.texture = loader.resources['assets/reanim/SunFlower_rightpetal5.png'].texture as PIXI.Texture
    this.rightPetal6.texture = loader.resources['assets/reanim/SunFlower_rightpetal6.png'].texture as PIXI.Texture
    this.rightPetal7.texture = loader.resources['assets/reanim/SunFlower_rightpetal7.png'].texture as PIXI.Texture
    this.rightPetal8.texture = loader.resources['assets/reanim/SunFlower_rightpetal8.png'].texture as PIXI.Texture
    this.rightPetal8.texture = loader.resources['assets/reanim/SunFlower_rightpetal9.png'].texture as PIXI.Texture
    this.topPetals.texture = loader.resources['assets/reanim/SunFlower_toppetals.png'].texture as PIXI.Texture
    this.bottomPetals.texture = loader.resources['assets/reanim/SunFlower_bottompetals.png'].texture as PIXI.Texture
 
    this.baseWidth = this.headSprite.width + 26
    this.baseHeight = this.headSprite.height + this.stalkSprite.height

    this.headSprite.position.set(14.3, 20.4)
    this.headSprite.scale.set(0.800, 0.712)
    this.stalkSprite.position.set(36.1, 52.6)

    this.leftPetal8.position.set(22.3, 47.8)
    this.leftPetal7.position.set(14.1, 44.3)
    this.leftPetal6.position.set(8.8, 40.4)
    this.leftPetal5.position.set(5.6, 34.5)
    this.leftPetal4.position.set(8, 26.2)
    this.leftPetal3.position.set(12.5, 21.7)
    this.leftPetal2.position.set(19.6, 15.5)
    this.leftPetal1.position.set(25.7, 14.4)
    this.bottomPetals.position.set(30.1, 47.8)
    this.rightPetal9.position.set(43.4, 47.9)
    this.rightPetal8.position.set(48, 45.1)
    this.rightPetal7.position.set(51.6, 42.1)
    this.rightPetal6.position.set(56.4, 37.4)
    this.rightPetal5.position.set(58.2, 31.4)
    this.rightPetal4.position.set(55.1, 23.6)
    this.rightPetal3.position.set(51.7, 20.7)
    this.rightPetal2.position.set(47.7, 17.5)
    this.rightPetal1.position.set(42.5, 15.2)
    this.topPetals.position.set(31.9, 14.7)

    let g = new PIXI.Graphics()
    g.lineStyle({
      width: 1,
      color: 0x0000ff
    })

    g.moveTo(1, 1)
    g.lineTo(this.baseWidth - 1, 1)
    g.lineTo(this.baseWidth - 1, this.baseHeight - 1)
    g.lineTo(1, this.baseHeight - 1)
    g.lineTo(1, 1)
    this.container.addChild(g)

    this.container.addChild(
      this.stalkSprite,
      this.leftPetal8,
      this.leftPetal7,
      this.leftPetal6,
      this.leftPetal5,
      this.leftPetal4,
      this.leftPetal3,
      this.leftPetal2,
      this.leftPetal1,
      this.bottomPetals,
      this.rightPetal9,
      this.rightPetal8,
      this.rightPetal7,
      this.rightPetal6,
      this.rightPetal5,
      this.rightPetal4,
      this.rightPetal3,
      this.rightPetal2,
      this.rightPetal1,
      this.headSprite
    )
  }

  update() {

  }

  add() {
    app.stage.addChild(this.container)
  }

  remove() {
    app.stage.removeChild(this.container)
  }
}

loader.add([
  'assets/reanim/PeaShooter_stalk_bottom.png',
  'assets/reanim/SunFlower_head.png',
  'assets/reanim/SunFlower_leftpetal1.png',
  'assets/reanim/SunFlower_leftpetal2.png',
  'assets/reanim/SunFlower_leftpetal3.png',
  'assets/reanim/SunFlower_leftpetal4.png',
  'assets/reanim/SunFlower_leftpetal5.png',
  'assets/reanim/SunFlower_leftpetal6.png',
  'assets/reanim/SunFlower_leftpetal7.png',
  'assets/reanim/SunFlower_leftpetal8.png',
  'assets/reanim/SunFlower_rightpetal1.png',
  'assets/reanim/SunFlower_rightpetal2.png',
  'assets/reanim/SunFlower_rightpetal3.png',
  'assets/reanim/SunFlower_rightpetal4.png',
  'assets/reanim/SunFlower_rightpetal5.png',
  'assets/reanim/SunFlower_rightpetal6.png',
  'assets/reanim/SunFlower_rightpetal7.png',
  'assets/reanim/SunFlower_rightpetal8.png',
  'assets/reanim/SunFlower_rightpetal9.png',
  'assets/reanim/SunFlower_toppetals.png',
  'assets/reanim/SunFlower_bottompetals.png',
  'assets/reanim/DoomShroom_body.png',
  'assets/reanim/DoomShroom_head1.png',
  'assets/reanim/DoomShroom_head2.png',
  'assets/reanim/DoomShroom_head3.png',
  'assets/reanim/DoomShroom_sleepinghead.png',
  'assets/reanim/Pumpkin_damage2.png',
  'assets/reanim/Pumpkin_damage3.png',
  'assets/reanim/pumpkin_damage1.png',
  'assets/reanim/Pumpkin_front.png',
  'assets/reanim/Pumpkin_back.png',
  'assets/reanim/Wallnut_body.png',
  'assets/images/PopCap_Logo.jpg',
  'assets/images/SelectorScreen_Almanac.png']).load(() => {

    async function a() {
      const res = await (await fetch('./assets/reanim/Pumpkin.reanim')).text()
      const res1 = await (await fetch('./assets/reanim/Wallnut.reanim')).text()

      let pumpkin = new Pumpkin()
      let doomshroom = new DoomShroom()
      let doomshroomr = new PumpkinRanim(convertReanim(res) as any)
      let sunflower = new Sunflower()
      let wallnut = new WallnutRanim(convertReanim(res1) as any)
      function init (): void {
        pumpkin.init()
        pumpkin.add()

        doomshroom.init()
        doomshroom.add()

        doomshroom.container.position.set(pumpkin.container.width, 0)

        doomshroomr.init()
        doomshroomr.add()
        doomshroomr.container.position.set(pumpkin.container.width, doomshroom.container.height)
        
        sunflower.init()
        sunflower.add()

        sunflower.container.position.set(pumpkin.container.width + doomshroom.container.width, 0)
      
        wallnut.init()
        wallnut.add()

        wallnut.container.position.set(0, pumpkin.container.height)

      }

      const loop = () => {
        requestAnimationFrame(loop)
        pumpkin.update()
        doomshroom.update()
        doomshroomr.update()
        sunflower.update()
        wallnut.update()
      } 

      init()
      loop()

    }

    a()
})
