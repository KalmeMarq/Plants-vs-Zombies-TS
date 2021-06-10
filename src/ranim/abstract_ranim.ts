import * as PIXI from 'pixi.js'
import { app } from '..'

export type IAnimTrackInfo = {
  name: string,
  ticks: {
    x?: number,
    y?: number,
    sx?: number,
    sy?: number
    kx?: number,
    ky?: number,
    f?: number,
    i?: string
  }[]
}

export type IAnimInfo = {
  fps: number,
  tracks: IAnimTrackInfo[]
}

export default class ObjectRanim {
  public container: PIXI.Container
  protected frame: number = 0
  protected lastTime: number = 0

  protected animInfo: IAnimInfo = { fps: 0, tracks: [] }

  public constructor(animInfo: IAnimInfo) {
    this.container = new PIXI.Container()
    this.animInfo = animInfo
  }

  public init(): void {
    this.lastTime = new Date().getTime()
  }

  public update(): void {
    if(new Date().getTime() - this.lastTime >= 1000 / this.animInfo.fps) {
      this.lastTime = new Date().getTime()
      this.frame++
      if(this.frame > this.animInfo.tracks[1].ticks.length - 1) this.frame = 0
    }
  }

  public add() {
    app.stage.addChild(this.container)
  }

  public remove() {
    app.stage.removeChild(this.container)
  }
}