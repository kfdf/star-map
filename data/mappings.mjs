export function mapStarSize(value) {
  switch (value) {
    case 'dwarf': return 'd'
    case 'giant': return 'g'
    case 'super giant': return 's'
    default: throw 'starSize'
  } 
}
export function mapStarColor(value) { 
  switch (value) {
    case 'green': return 'g'
    case 'blue': return 'b'
    case 'orange': return 'o'
    case 'white': return 'w'
    case 'yellow': return 'y'
    case 'red': return 'r'
    default: throw 'starColor'
  }
}

export function mapPlanetName(value) {
  switch (value) {
    case 'I': return 10
    case 'I-a': return 11
    case 'I-b': return 12
    case 'I-c': return 13
    case 'I-d': return 14
    case 'II': return 20
    case 'II-a': return 21
    case 'II-b': return 22
    case 'II-c': return 23
    case 'II-d': return 24
    case 'III': return 30
    case 'III-a': return 31
    case 'III-b': return 32
    case 'III-c': return 33
    case 'III-d': return 34
    case 'IV': return 40
    case 'IV-a': return 41
    case 'IV-b': return 42
    case 'IV-c': return 43
    case 'IV-d': return 44
    case 'V': return 50
    case 'V-a': return 51
    case 'V-b': return 52
    case 'V-c': return 53
    case 'V-d': return 54
    case 'VI': return 60
    case 'VI-a': return 61
    case 'VI-b': return 62
    case 'VI-c': return 63
    case 'VI-d': return 64
    case 'VII': return 70
    case 'VII-a': return 71
    case 'VII-b': return 72
    case 'VII-c': return 73
    case 'VII-d': return 74
    case 'VIII': return 80
    case 'VIII-a': return 81
    case 'VIII-b': return 82
    case 'VIII-c': return 83
    case 'VIII-d': return 84
    case 'IX': return 90
    case 'IX-a': return 91
    case 'IX-b': return 92
    case 'IX-c': return 93
    case 'IX-d': return 94
    case 'Mercury': return 10
    case 'Venus': return 20
    case 'Earth': return 30
    case 'Earth-b': return 31
    case 'Mars': return 40
    case 'Jupiter': return 50
    case 'Jupiter-a': return 51
    case 'Jupiter-b': return 52
    case 'Jupiter-c': return 53
    case 'Jupiter-d': return 54
    case 'Saturn': return 60
    case 'Saturn-a': return 61
    case 'Uranus': return 70
    case 'Neptune': return 80
    case 'Neptune-a': return 81
    case 'Pluto': return 90
    default: throw 'planetName'
  }

}
export function mapPlanetType(value) {
  switch (value) {
    case 'Urea': 
    case 'Treasure': 
    case 'Rainbow': 
    case 'Plutonic': 
    case 'Lanthanide': 
    case 'Auric': return 'y' 
    case 'Selenic': return 'w'
    case 'Yttric': 
    case 'Ultraviolet': 
    case 'Oolite': 
    case 'Fluorescent': return 'v'
    case 'Gas Giant': return 'z'
    case 'Ruby': 
    case 'Maroon': 
    case 'Magma': 
    case 'Infrared': 
    case 'Dust': 
    case 'Crimson': 
    case 'Cimmerian': 
    case 'Carbide': return 'r'
    case 'Vinylogous': 
    case 'Super-Dense': 
    case 'Purple': 
    case 'Pellucid': 
    case 'Chondrite': return 'p'
    case 'Radioactive': 
    case 'Metal': 
    case 'Shattered': return 'o'
    case 'Xenolithic': 
    case 'Sapphire': 
    case 'Organic': 
    case 'Opalescent': return 'c'
    case 'Water': 
    case 'Ultramarine': 
    case 'Telluric': 
    case 'Noble': 
    case 'Hydrocarbon': 
    case 'Azure': return 'b'
    case 'Redux': 
    case 'Quasi-Degenerate': 
    case 'Primordial': 
    case 'Magnetic': 
    case 'Iodine': 
    case 'Halide': 
    case 'Green': 
    case 'Cyanic': 
    case 'Emerald': 
    case 'Copper': 
    case 'Chlorine': 
    case 'Alkali': 
    case 'Acid': return 'g'
    default: throw 'planetType' 
  }
}