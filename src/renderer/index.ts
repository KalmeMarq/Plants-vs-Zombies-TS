import { ipcRenderer } from 'electron'
import * as PIXI from 'pixi.js'

let app = new PIXI.Application({
  width: 800,
  height: 600,
  backgroundColor: 0x000000
})
document.getElementById('root')!.appendChild(app.view)

let loader = new PIXI.Loader()
let fullscreen = false
loader.add('./assets/images/background4.jpg').load(() => {
  let sprite = new PIXI.Sprite(loader.resources['./assets/images/background4.jpg'].texture)

  app.stage.addChild(sprite)

  sprite.interactive = true
})

window.addEventListener('keydown', (e) => {
  if(e.key === 'F11') {
    fullscreen = !fullscreen
    ipcRenderer.send('pvzts:fullscreen', fullscreen ? 'true' : 'false')
  }
})

window.addEventListener('resize', () => {
  if(window.innerWidth > 800) {
    let a = window.innerWidth / window.innerHeight
    app.view.style.height = '100vh'

  } else {
    app.view.style.height = '600px'
  }
})