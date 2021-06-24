import { IPVZFont } from "../utils/Converters"

export default class FontManager {
  public fonts: Map<string, {
    img: string,
    info: IPVZFont
  }> = new Map()
  
  public constructor() {
  }

  public addFont(name: string, url: string, info: IPVZFont): void {
    this.fonts.set(name, { img: url, info: info })
  }
}