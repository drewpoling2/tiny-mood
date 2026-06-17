/**
 * Converts a CSS color string (hex, rgb(), rgba(), hsl(), or
 * hsla() -- see parse-color.ts) to OKLCH.
 *
 * Implements the standard sRGB -> linear -> OKLab -> OKLCH path
 * (Björn Ottosson's OKLab), the exact inverse of the matrices
 * used in oklch.ts.
 */

import type { Oklch } from './oklch.js'
import { parseColor, type Rgb } from './parse-color.js'

function srgbChannelToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

function rgbToOklch({ r, g, b }: Rgb): Oklch {
  const lr = srgbChannelToLinear(r / 255)
  const lg = srgbChannelToLinear(g / 255)
  const lb = srgbChannelToLinear(b / 255)

  const l_ = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb)
  const m_ = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb)
  const s_ = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb)

  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_
  const bb = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_

  const c = Math.sqrt(a * a + bb * bb)
  let h = (Math.atan2(bb, a) * 180) / Math.PI
  if (h < 0) h += 360

  return { l: L, c, h }
}

/**
 * Convert any supported CSS color string to OKLCH.
 * Throws a clear error for unsupported formats (named colors,
 * oklch()/lab()/lch(), malformed strings) -- see parseColor.
 */
export function colorToOklch(input: string): Oklch {
  return rgbToOklch(parseColor(input))
}
