import Gradient from 'javascript-color-gradient'

interface HSL {
  h: number
  s: number
  l: number
}

const hexToHSL = (hex: string): HSL => {
  let r = 0, g = 0, b = 0

  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16)
    g = parseInt(hex[2] + hex[2], 16)
    b = parseInt(hex[3] + hex[3], 16)
  }
   else {
    r = parseInt(hex.slice(1, 3), 16)
    g = parseInt(hex.slice(3, 5), 16)
    b = parseInt(hex.slice(5, 7), 16)
  }
  r /= 255
  g /= 255
  b /= 255

  const cmin = Math.min(r, g, b)
  const cmax = Math.max(r, g, b)
  const delta = cmax - cmin

  let h = 0
  let s = 0
  const l = (cmax + cmin) / 2

  if (delta !== 0) {
    if (cmax === r) h = ((g - b) / delta) % 6
    else if (cmax === g) h = (b - r) / delta + 2
    else h = (r - g) / delta + 4

    h = Math.round(h * 60)
    if (h < 0) h += 360

    s = delta / (1 - Math.abs(2 * l - 1))
  }

  return { h, s, l }
}

const hslToHex = ({ h, s, l }: HSL): string => {
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs((h / 60) % 2 - 1))
  const m = l - c / 2

  let r = 0, g = 0, b = 0

  if (h < 60) { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }

  const toHex = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, "0")

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

const rotateHue = (hex: string, degrees: number): string => {
  const hsl = hexToHSL(hex)
  hsl.h = (hsl.h + degrees) % 360
  return hslToHex(hsl)
}

export const useGradient = (start: string): string => {
  const gradient = new Gradient()
    .setColorGradient(start, rotateHue(start, 40))
    .setMidpoint(3)
    .getColors()

  const color1 = gradient[0]
  const color2 = gradient[1]
  const color3 = gradient[2]

  return [
    `linear-gradient(135deg, ${color1 + 'ff'}, ${color1 + '00'})`,
    `linear-gradient(200deg, ${color2 + '9b'}, ${color2 + '00'})`,
    `linear-gradient(300deg, ${color3 + '37'}, ${color3 + '00'})`
  ].join(', ')
}