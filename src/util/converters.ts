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
  f?: number
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
  layerSetImage: string,
  layerSetAscent: number,
  layerSetCharWidths: [IPVZCharList, IPVZWidthList],
  layerSetImageMap: IPVZRectList,
  layerSetCharOffsets: IPVZOffsetList,
  layerSetKerningPairs?: [IPVZKerningPairs, IPVZKerningValues],
  layerAscentPadding: number,
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

export function convertTextsFile(str: string): IPVZTexts {
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

export function convertReanim(str: string): IPVZReanim {
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

export function convertResourcesFile(str: string) {
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

export function convertFontInfo(str: string): IPVZFont {
  let obj: IPVZFont = {
    charList: [],
    widthList: [],
    rectList: [],
    offsetList: [],
    layers: [
      {
        layerSetImage: '',
        layerSetAscent: 0,
        layerSetCharWidths: [[], []],
        layerSetImageMap: [],
        layerSetCharOffsets: [],
        layerAscentPadding: 0,
        layerSetLineSpacingOffset: 0,
        layerSetPointSize: 0,
        setDefaultPointSize: 0
      }
    ]
  }
  
  return obj
}