export default class BinaryWriter {
  public buffer: Uint8Array
  public view: DataView
  public pos: number = 0
  public textEncoder = new TextEncoder()

  public constructor() {
    this.buffer = new Uint8Array(32)
    this.view = new DataView(this.buffer.buffer)
  }

  public ensureCapacity(size: number) {
    let currLength = this.buffer.length
    
    if(currLength < this.pos + size) {
      const oldBuffer = this.buffer
      this.buffer = new Uint8Array(currLength + size)
      this.buffer.set(oldBuffer)
      this.view = new DataView(this.buffer.buffer)
    }
  }

  public writeUint32(value: number) {
    this.ensureCapacity(4)
    this.view.setUint32(this.pos, value, true)
    this.pos += 4
  }

  public writeInt32(value: number) {
    this.ensureCapacity(4)
    this.view.setInt32(this.pos, value, true)
    this.pos += 4
  }

  public writeUint16(value: number) {
    this.ensureCapacity(2)
    this.view.setUint16(this.pos, value, true)
    this.pos += 2
  }

  public writeInt16(value: number) {
    this.ensureCapacity(2)
    this.view.setInt16(this.pos, value, true)
    this.pos += 2
  }

  public writeByte(value: number) {
    this.ensureCapacity(1)
    this.view.setInt8(this.pos, value)
    this.pos += 1
  }

  public writeBytes(value: number[]) {
    for(let i = 0; i < value.length; i++) {
      this.writeByte(value[i])
    }
  }

  public finish() {
    return this.buffer.subarray(0, this.pos)
  }
}