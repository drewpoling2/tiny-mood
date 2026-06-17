/**
 * Parses common CSS color string formats into a single RGB
 * representation, which then feeds the sRGB -> OKLCH conversion
 * in color-to-oklch.ts.
 *
 * Supported formats:
 *   #rgb, #rrggbb           (hex, 3 or 6 digit, with or without #)
 *   rgb(r, g, b)             (also accepts rgba(r, g, b, a) -- alpha ignored)
 *   rgb(r g b)               (modern space-separated CSS syntax)
 *   hsl(h, s%, l%)            (also accepts hsla -- alpha ignored)
 *   hsl(h s% l%)              (modern space-separated CSS syntax)
 *
 * Deliberately NOT supported (out of scope): named colors
 * ("forestgreen"), oklch()/lab()/lch(), color-mix(), CSS
 * variables. Passing any of these throws a clear error rather
 * than silently producing a wrong color.
 */

export interface Rgb {
  r: number
  g: number
  b: number
}

function clampByte(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)))
}

function parseHexColor(input: string): Rgb | null {
  const cleaned = input.replace('#', '').trim()

  if (/^[0-9a-fA-F]{6}$/.test(cleaned)) {
    return {
      r: parseInt(cleaned.slice(0, 2), 16),
      g: parseInt(cleaned.slice(2, 4), 16),
      b: parseInt(cleaned.slice(4, 6), 16)
    }
  }

  if (/^[0-9a-fA-F]{3}$/.test(cleaned)) {
    const r = cleaned[0] + cleaned[0]
    const g = cleaned[1] + cleaned[1]
    const b = cleaned[2] + cleaned[2]
    return {
      r: parseInt(r, 16),
      g: parseInt(g, 16),
      b: parseInt(b, 16)
    }
  }

  return null
}

function parseRgbColor(input: string): Rgb | null {
  const match = input.match(/^rgba?\(([^)]+)\)$/i)
  if (!match) return null

  const parts = match[1]
    .replace('/', ',')
    .split(/[\s,]+/)
    .filter(Boolean)

  if (parts.length < 3) return null

  const [r, g, b] = parts.map(p => parseFloat(p))
  if ([r, g, b].some(n => Number.isNaN(n))) return null

  return { r: clampByte(r), g: clampByte(g), b: clampByte(b) }
}

function hslToRgb(h: number, s: number, l: number): Rgb {
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2

  let r = 0
  let g = 0
  let b = 0

  if (h < 60) {
    r = c
    g = x
  } else if (h < 120) {
    r = x
    g = c
  } else if (h < 180) {
    g = c
    b = x
  } else if (h < 240) {
    g = x
    b = c
  } else if (h < 300) {
    r = x
    b = c
  } else {
    r = c
    b = x
  }

  return {
    r: clampByte((r + m) * 255),
    g: clampByte((g + m) * 255),
    b: clampByte((b + m) * 255)
  }
}

function parseHslColor(input: string): Rgb | null {
  const match = input.match(/^hsla?\(([^)]+)\)$/i)
  if (!match) return null

  const parts = match[1]
    .replace('/', ',')
    .split(/[\s,]+/)
    .filter(Boolean)

  if (parts.length < 3) return null

  const h = parseFloat(parts[0])
  const s = parseFloat(parts[1].replace('%', '')) / 100
  const l = parseFloat(parts[2].replace('%', '')) / 100

  if ([h, s, l].some(n => Number.isNaN(n))) return null

  return hslToRgb(((h % 360) + 360) % 360, s, l)
}

/**
 * Parse any supported CSS color string into RGB (0-255 per
 * channel). Throws a clear, specific error for unsupported
 * formats (named colors, oklch(), etc.) rather than silently
 * returning a wrong or default color.
 */
export function parseColor(input: string): Rgb {
  const trimmed = input.trim()

  const hex = parseHexColor(trimmed)
  if (hex) return hex

  const rgb = parseRgbColor(trimmed)
  if (rgb) return rgb

  const hsl = parseHslColor(trimmed)
  if (hsl) return hsl

  throw new Error(
    `Unsupported color format: "${input}". ` +
      'tiny-mood supports hex (#rrggbb, #rgb), rgb()/rgba(), and hsl()/hsla(). ' +
      'Named colors and oklch()/lab()/lch() are not supported -- ' +
      'convert to one of the supported formats first.'
  )
}
