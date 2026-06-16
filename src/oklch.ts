export interface Oklch {
  l: number
  c: number
  h: number
  alpha?: number
}

function oklchToOklab(c: Oklch): { L: number; a: number; b: number } {
  const hRad = (c.h * Math.PI) / 180
  return {
    L: c.l,
    a: c.c * Math.cos(hRad),
    b: c.c * Math.sin(hRad)
  }
}

function oklabToLinearSrgb(lab: { L: number; a: number; b: number }): {
  r: number
  g: number
  b: number
} {
  const l_ = lab.L + 0.3963377774 * lab.a + 0.2158037573 * lab.b
  const m_ = lab.L - 0.1055613458 * lab.a - 0.0638541728 * lab.b
  const s_ = lab.L - 0.0894841775 * lab.a - 1.291485548 * lab.b

  const l = l_ * l_ * l_
  const m = m_ * m_ * m_
  const s = s_ * s_ * s_

  return {
    r: 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    b: -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s
  }
}

function linearToSrgbChannel(x: number): number {
  const clamped = Math.max(0, Math.min(1, x))
  return clamped <= 0.0031308
    ? 12.92 * clamped
    : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055
}

export function oklchToRgbaString(c: Oklch): string {
  const lab = oklchToOklab(c)
  const linear = oklabToLinearSrgb(lab)

  const r = Math.round(linearToSrgbChannel(linear.r) * 255)
  const g = Math.round(linearToSrgbChannel(linear.g) * 255)
  const b = Math.round(linearToSrgbChannel(linear.b) * 255)
  const a = c.alpha ?? 1

  return `rgba(${r}, ${g}, ${b}, ${a})`
}
