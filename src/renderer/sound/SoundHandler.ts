import App from "..";

export default class SoundHandler {
  public app: App
  public context: AudioContext
  private gainNode: GainNode
  public sounds: { [key: string]: AudioBuffer }
  public playing: AudioBufferSourceNode[] = []

  public constructor(app: App) {
    this.app = app
    this.context = new AudioContext()
    this.gainNode = this.context.createGain()
    this.gainNode.connect(this.context.destination);
    this.sounds = {}
  }

  public play(name: string, volume?: number): void {
    let sound = this.sounds[name]
    
    if(sound === undefined) {
      this.fetchSound(name).then(() => {
        this.play(name)
      })
    } else {
      let sound = this.context.createBufferSource()
      sound.buffer = this.sounds[name]

      sound.connect(this.gainNode)      
      this.gainNode.gain.value = volume ?? 1
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