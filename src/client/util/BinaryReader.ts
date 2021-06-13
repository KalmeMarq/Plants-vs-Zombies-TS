export default class BinaryReader {
  public buffer: Uint8Array
  public view: DataView
  public pos: number = 0

  public constructor(data: Uint8Array) {
    this.buffer = new Uint8Array(data)
    this.view = new DataView(this.buffer.buffer)
  }

  public readUint32() {
    let value = this.view.getUint32(this.pos, true)
    this.pos += 4
    return value
  }

  public readInt32() {
    let value = this.view.getInt32(this.pos, true)
    this.pos += 4
    return value
  }

  public readUint16() {
    let value = this.view.getUint16(this.pos, true)
    this.pos += 2
    return value
  }

  public readInt16() {
    let value = this.view.getInt16(this.pos, true)
    this.pos += 2
    return value
  }

  public readByte() {
    let value = this.view.getInt8(this.pos)
    this.pos += 1
    return value
  }

  public readBytes(length: number) {
    let value = []
    for(let i = 0; i < length; i++) {
      value.push(this.readByte())
    }
    return new Uint8Array(value)
  }
}