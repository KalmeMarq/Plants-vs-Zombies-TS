export default class ReanimTrack {
  public transforms: any[]
  public name: string
  public numTransforms: number
  
  public constructor() {
    this.name = ''
    this.transforms = []
    this.numTransforms = 0
  }
}