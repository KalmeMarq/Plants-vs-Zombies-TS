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