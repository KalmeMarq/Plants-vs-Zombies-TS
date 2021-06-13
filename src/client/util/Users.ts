import BinaryReader from "./BinaryReader"
import BinaryWriter from "./BinaryWriter"

export default class Users {
  public path: string = ''
  public numOfUsers: number = 0
  public users: [string, number][] = []

  public constructor(path: string) {
    this.path = path
  }

  public load(reader: BinaryReader): void {
    let version = reader.readUint32()
    if(version !== 0x0E) {
      throw new Error('Incompatible version!')
    }

    this.numOfUsers = reader.readUint16()
    for (let i = 0; i < this.numOfUsers; i++) {
      let length = reader.readUint16()
      let name = new TextDecoder().decode(reader.readBytes(length))
      let timestamp = reader.readUint32()
      let fileNumber = reader.readUint32()
      this.users.push([name, fileNumber])
    }
  }

  public write(): Uint8Array {
    let writer = new BinaryWriter()
    writer.writeUint32(14)

    writer.writeUint16(this.numOfUsers)

    for(let i = 0; i < this.numOfUsers; i++) {
      let user = this.users[i]

      writer.writeUint16(user[0].length)
      writer.writeBytes(Array.from(writer.textEncoder.encode(user[0])))
      writer.writeUint32(0)
      writer.writeUint32(i + 1)
    }

    return writer.finish()
  }

  public download(): void {
    let blob = new Blob([this.write()], {type: ""})
    let link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    let fileName = 'users.dat'
    link.download = fileName
    link.click()
  }
}