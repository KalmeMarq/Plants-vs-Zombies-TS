import path from 'path'

export default class Paths {
  public static DATAPATH() {
    switch(process.platform) {
      case 'darwin': {
        return path.join(process.env.HOME as string, 'Library', 'Application Support')
      }
      case 'win32': {
        return process.env.APPDATA as string
      }
      case 'linux': {
        return process.env.HOME as string
      }
      default: {
        return ''
      }
    }
  }
}