import App from "..";

export default class MusicManager {
  public app: App
  public context: AudioContext
  private gainNode: GainNode
  public sounds: { [key: string]: AudioBuffer }
  public id: string = ''
  public playing: AudioBufferSourceNode[] = []
  public paused: boolean = false
  public pausedAt: number = 0

  public constructor(app: App) {
    this.app = app
    this.context = new AudioContext()
    this.gainNode = this.context.createGain()
    this.gainNode.connect(this.context.destination);
    this.sounds = {}
  }
  
  public play(name: string, volume?: number): void {
    let sound = this.sounds[name]
    console.log(volume);
    
    if(sound === undefined) {
      this.fetchSound(name).then(() => {
        this.play(name, volume)
      })
    } else {
      let sound = this.context.createBufferSource()
      sound.buffer = this.sounds[name]
      
      sound.connect(this.gainNode)
      
      this.stopAll()
      this.id = name
      this.gainNode.gain.value = volume ?? 1
      
      if(this.paused) {
        this.paused = false
        sound.start(0, this.context.currentTime)
      } else {
        sound.start(0)
      }
      
      sound.onended = () => {
        sound.disconnect()
      }
      
      this.playing.push(sound)
    }
  }

  public pause(): void {
    if(!this.paused) {
      this.playing[0].stop(0)
      this.pausedAt = this.context.currentTime
      this.paused = true
    }
  }

  public resume(): void {
    if(this.paused) {
      let id = this.id
      this.stopAll()
      this.play(id, this.gainNode.gain.value)
    }
  }

  public async fetchSound(name: string): Promise<void> {
    const res = await fetch(`./assets/sounds/${name}`)
    const data = await res.arrayBuffer()
    const buffer = await this.context.decodeAudioData(data)
    this.sounds[name] = buffer
  }

  public stopAll(): void {
    this.id = ''
    this.playing.map((s) => {
      s.stop()
      s.disconnect()
    })
    this.playing = []
  }
}