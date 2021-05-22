import data from './data.js'
function getPlanetColor(value) {
  switch (value) {
    case 'y' : return 'yellow'
    case 'w' : return 'lightgray'
    case 'v' : return 'violet'
    case 'z' : return 'gray'
    case 'p' : return 'mediumorchid'
    case 'r' : return 'red'
    case 'o' : return 'orange'
    case 'g' : return 'limegreen'
    case 'c' : return 'cyan'
    case 'b' : return 'deepskyblue'
    default: throw 'planetColor'
    
  }
}
function getPlanetSize(value) {
  switch (value) {
    case 's':
    case 'S': return 0.6
    case 'm':
    case 'M': return 0.8
    case 'g':
    case 'G': return 1
    default: throw 'planetSize'
  } 
}
function getIsMoon(value) {
  switch (value) {
    case 's':
    case 'm':
    case 'g': return true
    case 'M': 
    case 'S': 
    case 'G': return false
    default: throw 'isMoon'
  } 
}
export class Planet {
  constructor(colorSize, hazards, minerals, quality, bioforms) {
    this.isMoon = getIsMoon(colorSize[1])
    this.color = getPlanetColor(colorSize[0])
    this.size = getPlanetSize(colorSize[1])
    this.thermal = +hazards / 100 | 0
    this.weather = (+hazards % 100) / 10 | 0
    this.tectonic = +hazards % 10
    this.minerals = +minerals
    this.quality = +quality
    this.bioforms = +bioforms
  }
}
function getStarColor(value) {
  switch (value) {
    case 'g' : return 'limegreen'
    case 'b' : return 'deepskyblue'
    case 'o' : return 'orange'
    case 'w' : return 'white'
    case 'y' : return 'yellow'
    case 'r' : return 'red'
    default: throw 'starColor'
    
  }
}
function getStarSize(value) {
  switch (value) {
    case 'd': return 0.5
    case 'g': return 0.66
    case 's': return 1
    default: throw 'starSize'
  } 
}
export class Star {
  constructor(cluster, name, x, y, color, size) {
    this.x = +x
    this.y = +y
    this.cluster = cluster
    this.name = name
    this.color = getStarColor(color)
    this.size = getStarSize(size)
    /** @type {Planet[]} */
    this.planets = []
    this.renderCycle = 0
  }
}
let ctx = document.createElement('canvas').getContext('2d')
ctx.font = '10px sans-serif'

export class Cluster {
  constructor(name, x, y) {
    this.name = name
    this.x = x
    this.y = y
    let tm = ctx.measureText(name)
    this.width = tm.width
    this.height = tm.emHeightAscent + tm.emHeightDescent
    this.renderCycle = 0
  }
}
/** @type {Star[]} */
export const stars = []

let star
for (let line of data.split('\n')) {
  let parts = line.split(',')
  if (parts.length == 6) {
    stars.push(star = new Star(...parts))
  } else {
    star.planets.push(new Planet(...parts))
  }
}
for (let star of stars) {
  star.planets.sort((a, b) => a.order - b.order)
}
/** @type {Cluster[]} */
export const clusters = []
/** @type {Map<string, Star[]>} */
let starsByCluster = new Map()
for (let star of stars) {
  let arr = starsByCluster.get(star.cluster)
  if (!arr) starsByCluster.set(star.cluster, arr = [])  
  arr.push(star)
}
for (let [name, stars] of starsByCluster) {
  let avgX = stars.reduce((x, star) => x + star.x, 0) / stars.length
  let avgY = stars.reduce((y, star) => y + star.y, 0) / stars.length
  clusters.push(new Cluster(name, avgX, avgY))
}
clusters.sort((a, b) => a.y - b.y)
for (let i = 1; i < clusters.length; i++) {
  for (let j = i - 1; j >= 0; j--) {
    let a = clusters[i], b = clusters[j]
    if (a.y - a.height > b.y) break
    if (Math.abs(a.x - b.x) > (a.width + b.width) / 2) continue
    a.y += a.height
    let k = i
    while (k + 1 < clusters.length && clusters[k + 1].y < a.y) {
      clusters[k] = clusters[k + 1]
      k += 1
    }
    if (k != i) {
      clusters[k] = a
      i -= 1
    }
    break
  }
}
export const regions = []
while (regions.length < 10) {
  regions.push(Array(10).fill(0)
    .map(_ => ({ labels: [], stars: [] })))
}
let outboundsRegion = { labels: [], stars: [] }
export function getRegion(x, y) {
  if (x < 0 || y < 0 || x >= 10 || y >= 10) {
    return outboundsRegion
  } else {
    return regions[x][y]
  }
}
function getRegionsForBox(x, y, w, h) {
  let x1 = Math.floor(x / 100)
  let y1 = Math.floor(y / 100)
  let x2 = Math.ceil((x + w) / 100)
  let y2 = Math.ceil((y + h) / 100)
  let ret = []
  for (let x = x1; x < x2; x++) {
    for (let y = y1; y < y2; y++) {
      if (x < 0 || y < 0 || x >= 10 || y >= 10) continue
      ret.push(regions[x][y])
      
      // ret.push(getRegion(x, y))
    }
  }
  return ret
}

for (let star of stars) {
  // size doubled for better mouseover detection at region borders
  let x = star.x - star.size * 2
  let y = star.y - star.size * 2
  let w = star.size * 4
  for (let region of getRegionsForBox(x, y, w, w)) {
    region.stars.push(star)
  }
}
for (let cluster of clusters) {
  let { width, height } = cluster
  let x = cluster.x - width / 2
  let y = cluster.y - height
  for (let region of getRegionsForBox(x, y, width, height)) {
    region.labels.push(cluster)
  }  
}
