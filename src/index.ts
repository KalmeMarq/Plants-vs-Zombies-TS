import * as PIXI from 'pixi.js'

const options: PIXI.IApplicationOptions = {
  width: 800,
  height: 600,
  backgroundColor: 0x000000
}

const root = document.getElementById('root') as HTMLDivElement
const app: PIXI.Application = new PIXI.Application(options)
const loader: PIXI.Loader = new PIXI.Loader('./')

app.view.style.width = '800px'
app.view.style.height = '600px'
root.appendChild(app.view)
app.stage.sortableChildren = true
app.renderer.plugins.interaction.cursorStyles.default = 'url("./assets/cursor.png"), default'
app.renderer.plugins.interaction.cursorStyles.pointer = 'url("./assets/cursor_pointer.png"), pointer'

class Pumpkin {
  damage = 0
  container: PIXI.Container
  backSprite: PIXI.Sprite
  frontSprite: PIXI.Sprite
  damage1Sprite: PIXI.Sprite
  damage2Sprite: PIXI.Sprite
  damage3Sprite: PIXI.Sprite
  baseWidth: number
  baseHeight: number
  delta: number = -1
  scaleW: number = 1
  scaleH: number = 1

  constructor() {
    this.container = new PIXI.Container()

    this.backSprite = new PIXI.Sprite(loader.resources['assets/level/plants/pumkin/Pumpkin_back.png'].texture)
    this.frontSprite = new PIXI.Sprite(loader.resources['assets/level/plants/pumkin/Pumpkin_front.png'].texture)
    this.damage1Sprite = new PIXI.Sprite(loader.resources['assets/level/plants/pumkin/Pumpkin_damage1.png'].texture)
    this.damage2Sprite = new PIXI.Sprite(loader.resources['assets/level/plants/pumkin/Pumpkin_damage2.png'].texture)
    this.damage3Sprite = new PIXI.Sprite(loader.resources['assets/level/plants/pumkin/Pumpkin_damage3.png'].texture)

    // this.backSprite.texture = loader.resources['assets/level/plants/pumkin/Pumpkin_back.png'].texture as PIXI.Texture
    // this.frontSprite.texture = loader.resources['assets/level/plants/pumkin/Pumpkin_front.png'].texture as PIXI.Texture
    // this.damage1Sprite.texture = loader.resources['assets/level/plants/pumkin/Pumpkin_damage1.png'].texture as PIXI.Texture
    // this.damage2Sprite.texture = loader.resources['assets/level/plants/pumkin/Pumpkin_damage2.png'].texture as PIXI.Texture
    // this.damage3Sprite.texture = loader.resources['assets/level/plants/pumkin/Pumpkin_damage3.png'].texture as PIXI.Texture
  
    this.backSprite.anchor.set(0.5, 1)
    this.frontSprite.anchor.set(0.5, 1)
    this.damage1Sprite.anchor.set(0.5, 1)
    this.damage2Sprite.anchor.set(0.5, 1)
    this.damage3Sprite.anchor.set(0.5, 1)

    this.baseWidth = this.backSprite.width
    this.baseHeight = this.backSprite.height
  }

  init() {
    
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

// let logo: PIXI.Sprite
// let w = 0
// let h = 0

// let l: PIXI.Sprite
let pumpkin = new Pumpkin()
function init (): void {
  const logo = new PIXI.Sprite(loader.resources['assets/PopCap_Logo.jpg'].texture)
  logo.position.x = app.screen.width / 2
  logo.position.y = app.screen.height / 2
  logo.anchor.x = 0.5
  logo.anchor.y = 0.5

  app.stage.addChild(logo)
}

loader.add(['assets/PopCap_Logo.jpg', 'assets/almanac/SelectorScreen_Almanac.png']).load(() => {
  init()
})