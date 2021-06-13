import SoundHandler from "./sound/SoundHandler";

export default class Game {
  public soundHandler: SoundHandler

  public constructor() {
    this.soundHandler = new SoundHandler()
  }

  public init(): void {
    let soundHandler = new SoundHandler()

    let btn = document.createElement('button')
    btn.innerText = 'Play'
  
    let btn1 = document.createElement('button')
    btn1.innerText = 'Stop All'
  
    btn.addEventListener('click', () => {
      soundHandler.play('points.ogg')
    })
  
    btn1.addEventListener('click', () => {
      soundHandler.stopAll()
    })
  
    document.getElementById('root')?.appendChild(btn)
    document.getElementById('root')?.appendChild(btn1)
  }

  public update(): void {
  }
}