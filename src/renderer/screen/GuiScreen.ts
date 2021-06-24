import { Container } from "pixi.js"
import App from ".."

export default abstract class GuiScreen {
  public app: App
  public container: Container

  public constructor(app: App) {
    this.app = app
    this.container = new Container()
  }

  public init(): void {
  }

  public update(): void {
  }
}