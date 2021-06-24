export type IPVZTexts = {
  [key: string]: { text: string | string[] }
}

export type IPVZReanimTicks = {
  x?: number,
  y?: number,
  sx?: number,
  sy?: number,
  kx?: number,
  ky?: number,
  i?: number,
  f?: number,
  a?: number
}

export type IPVZReanimTrack = {
  name: string,
  ticks: IPVZReanimTicks[]
}

export type IPVZReanim = {
  fps: number,
  tracks: IPVZReanimTrack[]
}

export type IPVZResourceContents = {
  type: 'SetDefaults' | 'Image' | 'Sound',
  id?: string,
  idprefix?: string,
  path: string,
  cols?: number,
  rows?: number,
  minsubdivide?: boolean
  a8r8g8b8?: boolean
  ddsurface?: boolean,
  alphagrid?: string
}

export type IPVZResource = {
  id: string,
  contents: IPVZResourceContents[]
}

export type IPVZResources = {
  resources: IPVZResource[]
}

export type IPVZKerningPairs = string[]
export type IPVZCharList = string[]
export type IPVZKerningValues = number[]
export type IPVZWidthList = number[]
export type IPVZRectList = [number, number, number, number][]
export type IPVZOffsetList = [number, number][]

export type IPVZFontLayer = {
  createLayer: string,
  layerSetImage: string,
  layerSetAscent: number,
  layerSetCharWidths: [IPVZCharList, IPVZWidthList],
  layerSetImageMap: IPVZRectList,
  layerSetCharOffsets: IPVZOffsetList,
  layerSetKerningPairs?: [IPVZKerningPairs, IPVZKerningValues],
  layerSetAscentPadding: number,
  layerSetLineSpacingOffset: number,
  layerSetPointSize: number,
  setDefaultPointSize: number
}

export type IPVZFont = {
  charList: IPVZCharList,
  widthList: IPVZWidthList,
  rectList: IPVZRectList,
  offsetList: IPVZOffsetList,
  layers: IPVZFontLayer[]
}

export default class Converters {
  public static textsFile(str: string): IPVZTexts {
    let obj: IPVZTexts = {}
    let splitted = str.split('\r\n')
    let currKey = ''
  
    splitted.map((value, i, arr) => {
      let s = false
      if(arr[i + 1] !== undefined) {
        s = (arr[i + 1].startsWith('[') && arr[i + 1].endsWith(']') && arr[i + 1] !== arr[i + 1].toLowerCase())
      }
      
      if(!s) {
        if(value.startsWith('[') && value.endsWith(']') && value !== value.toLowerCase()) {
          currKey = value.split(/\[(.*?)\]/)[1]
          obj[currKey] = {
            text: ''
          }
        } else {
          if(obj[currKey].text === '') {
            obj[currKey].text = value
          } else if(!Array.isArray(obj[currKey].text)) {
            obj[currKey].text = [obj[currKey].text as string, value]
          } else {
            ;(obj[currKey].text as string[]).push(value)
          }
        }
      }
    })
  
    return obj
  }

  public static reanim(str: string): IPVZReanim {
    let file = str
    
    if(!file.startsWith('<reanim>')) {
      file = '<reanim>' + file
    }
    if(!file.endsWith('</reanim>')) {
      file += '</reanim>'
    }
  
    let obj: IPVZReanim = { fps: 0, tracks: [] }
  
    const parser = new DOMParser();
    const dom = parser.parseFromString(file, "application/xml").documentElement
  
    for(let i = 0; i < dom.children.length; i++) {
      let c = dom.children[i]
  
      if(c.tagName === 'fps') {
        obj['fps'] = parseInt(c.textContent as string)
      } else if(c.tagName === 'track') {
        let track: any = {
          name: '',
          ticks: []
        }
        for(let j = 0; j < c.children.length; j++) {
          let d = c.children[j]
  
          if(d.tagName === 'name') {
            track['name'] = d.textContent
          } else if(d.tagName === 't') {
            let tick: any = {}
            
            for(let k = 0; k < d.children.length; k++) {
              let e = d.children[k]
              
              let a = parseFloat(e.textContent as string)
              
              if(!isNaN(a)) {
                tick[e.tagName] = Number(a)
              } else {
                
                tick[e.tagName] = e.textContent
              }
            }
  
            track['ticks'].push(tick)
          }
        }
        obj['tracks'].push(track)
      }
    }
  
    return obj
  }
  
  public static resourcesFile(str: string) {
    let obj: IPVZResources = { resources: [] }
  
    const parser = new DOMParser();
    const dom = parser.parseFromString(str, "application/xml").documentElement
  
    for(let i = 0; i < dom.children.length; i++) {
      let c = dom.children[i]
      let resource: IPVZResource = { id: '', contents: [] }
  
      resource.id = c.getAttribute('id') ?? ''
  
      if(c.tagName === 'Resources') {
  
        for(let j = 0; j < c.children.length; j++) {
          let d = c.children[j]
  
          if(d.tagName === 'SetDefaults' || d.tagName === 'Image' || d.tagName === 'Sound') {
            let content: IPVZResourceContents = {
              type: d.tagName,
              path: d.getAttribute('path') ?? ''
            }
  
            if(d.getAttribute('id')) {
              content.id = d.getAttribute('id') as string
            }
  
            if(d.getAttribute('alphagrid')) {
              content.alphagrid = d.getAttribute('alphagrid') as string
            }
  
            if(d.getAttribute('idprefix')) {
              content.idprefix = d.getAttribute('idprefix') as string
            }
  
            if(d.getAttribute('cols')) {
              content.cols = parseFloat(d.getAttribute('cols') as string)
            }
  
            if(d.getAttribute('rows')) {
              content.rows = parseFloat(d.getAttribute('rows') as string)
            }
  
            if(d.getAttribute('minsubdivide')) {
              content.minsubdivide = true
            }
  
            if(d.getAttribute('a8r8g8b8')) {
              content.a8r8g8b8 = true
            }
            
            if(d.getAttribute('ddsurface')) {
              content.ddsurface = true
            }
  
            resource.contents.push(content)
          }
        }
  
        obj.resources.push(resource)
      }
    }
  
    return obj
  }
  
  public static fontInfo(str: string): IPVZFont {
    let obj: IPVZFont = {
      charList: [],
      widthList: [],
      rectList: [],
      offsetList: [],
      layers: []
    }
  
    let pos = 0
  
    let a = str.indexOf('Define CharList')
    let b = str.indexOf(');')
    pos = b + 2
  
    let c = str.slice(a + 'Define CharList'.length, b + 1).trim().replace(/\n/g, '').replace(/\r/g, '').replace(/ /g, '')
    c = c.slice(1, c.length - 1)
    c = '[' + c + ']'
    c = c.replace("'\"'", '"\\""')
    c = c.replace(/',/g, '",')
    c = c.replace(/,'/g, ',"')
    c = c.replace("['", '["')
    c = c.replace("']", '"]')
  
    obj.charList = JSON.parse(c)
    
    a = str.indexOf('Define WidthList')
    b = str.indexOf(');', pos)
    pos = b + 2
  
    c = str.slice(a + 'Define WidthList'.length, b + 1).trim().replace(/\n/g, '').replace(/\r/g, '').replace(/ /g, '')
    c = c.slice(1, c.length - 1)
    c = '[' + c + ']'
  
    obj.widthList = JSON.parse(c)
  
    a = str.indexOf('Define RectList')
    b = str.indexOf(');', pos)
    pos = b + 2
  
    c = str.slice(a + 'Define RectList'.length, b + 1).trim().replace(/\n/g, '').replace(/\r/g, '').replace(/ /g, '')
    c = c.slice(1, c.length - 1)
    c = '[' + c + ']'
    c = c.replace(/\(/g, '[')
    c = c.replace(/\)/g, ']')
  
    obj.rectList = JSON.parse(c)
    
    a = str.indexOf('Define OffsetList')
    b = str.indexOf(');', pos)
    pos = b + 2
  
    c = str.slice(a + 'Define OffsetList'.length, b + 1).trim().replace(/\n/g, '').replace(/\r/g, '').replace(/ /g, '')
    c = c.slice(1, c.length - 1)
    c = '[' + c + ']'
    c = c.replace(/\(/g, '[')
    c = c.replace(/\)/g, ']')
  
    obj.offsetList = JSON.parse(c)
  
    let rest = str.slice(pos, str.length).trim()
  
    let d = rest.split('\r\n')
    d.map((v, i) => {
      d[i] = v.replace(/\s{2,}/g, '=');
    })
  
    let currLayer: IPVZFontLayer = {
      createLayer: '',
      layerSetImage: '',
      layerSetAscent: 0,
      layerSetCharWidths: [[], []],
      layerSetImageMap: [],
      layerSetCharOffsets: [],
      layerSetAscentPadding: 0,
      layerSetLineSpacingOffset: 0,
      layerSetPointSize: 0,
      setDefaultPointSize: 0
    }
  
    d.map(v => {
      let g = v.split('=')
      if(g.length === 2) {
        g[1] = g[1].replace(';', '')
      }
  
      if(g[0] === '') {
        obj.layers.push(currLayer)
        currLayer = {
          createLayer: '',
          layerSetImage: '',
          layerSetAscent: 0,
          layerSetCharWidths: [[], []],
          layerSetImageMap: [],
          layerSetCharOffsets: [],
          layerSetAscentPadding: 0,
          layerSetLineSpacingOffset: 0,
          layerSetPointSize: 0,
          setDefaultPointSize: 0
        }
      }
  
      if(g[0] === 'CreateLayer') {
        currLayer.createLayer = g[1]
      }
  
      if(g[0] === 'LayerSetImage') {
        let n = g[1]
        n = n.slice(n.indexOf("'") + 1, n.lastIndexOf("'"))
        currLayer.layerSetImage = n
      }
  
      if(g[0] === 'LayerSetAscent') {
        let n = g[1]
        n = n.replace(currLayer.createLayer, '').trim()
        currLayer.layerSetAscent = parseFloat(n)
      }
  
      if(g[0] === 'LayerSetAscentPadding') {
        let n = g[1]
        n = n.replace(currLayer.createLayer, '').trim()
        currLayer.layerSetAscentPadding = parseFloat(n)
      }
  
      if(g[0] === 'LayerSetLineSpacingOffset') {
        let n = g[1]
        n = n.replace(currLayer.createLayer, '').trim()
        currLayer.layerSetLineSpacingOffset = parseFloat(n)
      }
  
      if(g[0] === 'LayerSetPointSize') {
        let n = g[1]
        n = n.replace(currLayer.createLayer, '').trim()
        currLayer.layerSetPointSize = parseFloat(n)
      }
  
      if(g[0] === 'LayerSetCharWidths') {
        if(currLayer.layerSetCharWidths[0].length === 0 && currLayer.layerSetCharWidths[1].length === 0) {
          let n = g[1]
          n = n.replace(currLayer.createLayer, '').trim()
  
          let m = n.split(' ')
          m.map((v, i) => {
            m[i] = v[0].toLowerCase() + v.substring(1, v.length)
          })
  
          let j = m[0]
          let k = m[1]
  
          if((j === 'charList' || j === 'rectList' || j === 'offsetList' || j === 'widthList') &&
          (k === 'charList' || k === 'rectList' || k === 'offsetList' || k === 'widthList')) {
            currLayer.layerSetCharWidths = [obj[j] as any, obj[k] as any]
          }
        } else {
          let n = g[1]
          n = n.replace(currLayer.createLayer, '').trim()
          n = n.replace(/\(/g, '[')
          n = n.replace(/\)/g, ']')
          n = n.replace(/'/g, '"')
  
          let p = [JSON.parse(n.substring(0, n.indexOf(']') + 1)), JSON.parse(n.substring(n.indexOf(']') + 1, n.length))]
  
          currLayer.layerSetCharWidths[0].push(p[0])
          currLayer.layerSetCharWidths[1].push(p[1])
        }
      }
  
      if(g[0] === 'LayerSetImageMap') {
        let n = g[1]
        n = n.replace(currLayer.createLayer, '').trim()
  
        let m = n.split(' ')
        m.map((v, i) => {
          m[i] = v[0].toLowerCase() + v.substring(1, v.length)
        })
  
        let j = m[0]
        let k = m[1]
  
        if((j === 'charList' || j === 'rectList' || j === 'offsetList' || j === 'widthList') &&
        (k === 'charList' || k === 'rectList' || k === 'offsetList' || k === 'widthList')) {
          currLayer.layerSetImageMap = obj[k] as any
        }
      }
  
      if(g[0] === 'LayerSetCharOffsets') {
        let n = g[1]
        n = n.replace(currLayer.createLayer, '').trim()
  
        let m = n.split(' ')
        m.map((v, i) => {
          m[i] = v[0].toLowerCase() + v.substring(1, v.length)
        })
  
        let j = m[0]
        let k = m[1]
  
        if((j === 'charList' || j === 'rectList' || j === 'offsetList' || j === 'widthList') &&
        (k === 'charList' || k === 'rectList' || k === 'offsetList' || k === 'widthList')) {
          currLayer.layerSetCharOffsets = [obj[j] as any, [...obj[k], [0, 0]] as any]
        }
      }
    })
  
    return obj
  }
}