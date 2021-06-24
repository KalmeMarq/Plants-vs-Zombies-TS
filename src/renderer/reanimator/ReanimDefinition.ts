export default class ReanimDefinition {
  public trackNameMap: { [key: string]: any }
  public tracks: any[]    
  public fps: number
  public numTracks: number
      
  public constructor() {
    this.fps = 0
    this.tracks = []
    this.trackNameMap = {}
    this.numTracks = 0
  }
}
