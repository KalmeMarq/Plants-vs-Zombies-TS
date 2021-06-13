export default class SoundHandler {
  public context: AudioContext
  public sounds: { [key: string]: AudioBuffer }

  public playing: AudioBufferSourceNode[] = []

  public constructor() {
    this.context = new AudioContext()
    this.sounds = {}
  }

  public play(name: string): void {
    let sound = this.sounds[name]
    
    if(sound === undefined) {
      this.fetchSound(name).then(() => {
        this.play(name)
      })
    } else {
      let sound = this.context.createBufferSource()
      sound.buffer = this.sounds[name]
      sound.connect(this.context.destination);
      sound.start(0)
      
      sound.onended = () => {
        sound.disconnect()
      }
      
      this.playing.push(sound)
    }
  }

  public async fetchSound(name: string): Promise<void> {
    const res = await fetch(`./assets/sounds/${name}`)
    const data = await res.arrayBuffer()
    const buffer = await this.context.decodeAudioData(data)
    this.sounds[name] = buffer
  }

  public stopAll(): void {
    this.playing.map((s) => {
      s.stop()
      s.disconnect()
    })
    this.playing = []
  }
}