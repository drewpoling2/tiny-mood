/**
 * calibrate.ts
 *
 * Translates raw, dimensionally-meaningless GloVe vectors into
 * the three human-readable mood axes (weight/energy/warmth) by
 * projecting onto directions defined by anchor words with known
 * mood values.
 *
 * METHOD: for each axis, build a "direction vector" in GloVe
 * space by taking a weighted average of (anchor_vector * anchor_axis_value)
 * across all anchors that have a non-zero value on that axis.
 * This produces a single direction in GloVe-space that represents
 * "increasing energy" (or weight, or warmth). Any new word's score
 * on that axis is then the dot product of its vector with that
 * direction, normalized to roughly [-1, 1].
 *
 * This is a standard, simple technique for inducing a labeled
 * axis from a small set of labeled examples in an embedding
 * space — sometimes called "axis projection" or a simplified
 * version of what's used in semantic differential analysis.
 */

import type { MoodVector, RawVector, GloveEntry } from './types.js'
import { CALIBRATION_ANCHORS } from './calibration-anchors.js'

function dot(a: RawVector, b: RawVector): number {
  let sum = 0
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    sum += a[i] * b[i]
  }
  return sum
}

function magnitude(v: RawVector): number {
  return Math.sqrt(dot(v, v))
}

function scale(v: RawVector, factor: number): RawVector {
  return v.map(x => x * factor)
}

function addVectors(a: RawVector, b: RawVector): RawVector {
  const len = Math.max(a.length, b.length)
  const result: RawVector = new Array(len).fill(0)
  for (let i = 0; i < len; i++) {
    result[i] = (a[i] ?? 0) + (b[i] ?? 0)
  }
  return result
}

interface AxisDirection {
  vector: RawVector
  /** magnitude of the direction vector, used for normalization */
  norm: number
  /** fitted scale factor, set after calibration against anchors */
  scale?: number
}

/**
 * Build a direction vector for one mood axis from the anchor
 * set, given the anchors' GloVe vectors (looked up separately)
 * and their known axis values.
 */
function buildAxisDirection(
  axis: 'weight' | 'energy' | 'warmth',
  anchorVectors: Map<string, RawVector>
): AxisDirection | null {
  let direction: RawVector = []
  let totalWeight = 0

  for (const anchor of CALIBRATION_ANCHORS) {
    const axisValue = anchor.mood[axis]
    if (axisValue === 0) continue

    const vec = anchorVectors.get(anchor.word)
    if (!vec) continue // anchor word wasn't found in the GloVe source

    direction = addVectors(direction, scale(vec, axisValue))
    totalWeight += Math.abs(axisValue)
  }

  if (totalWeight === 0 || direction.length === 0) return null

  const norm = magnitude(direction)
  if (norm === 0) return null

  return { vector: direction, norm }
}

export interface Calibration {
  weight: AxisDirection | null
  energy: AxisDirection | null
  warmth: AxisDirection | null
}

/**
 * Build the full calibration (all 3 axis directions) from a set
 * of GloVe entries for the anchor words. Call this once per
 * generation run, then reuse the result for every word being
 * scored.
 *
 * Also computes a per-axis scale factor by checking how well
 * the raw (unscaled) projections reproduce the anchors' own
 * known hand-assigned values -- this makes calibration self-
 * tuning rather than relying on a fixed guessed constant, so
 * it adapts automatically to whatever embedding dimensionality
 * or source corpus is actually in use (the real GloVe file will
 * have different vector statistics than this small fixture).
 */
export function buildCalibration(anchorEntries: GloveEntry[]): Calibration {
  const anchorVectors = new Map(
    anchorEntries.map(e => [e.word, e.vector] as const)
  )

  const weight = buildAxisDirection('weight', anchorVectors)
  const energy = buildAxisDirection('energy', anchorVectors)
  const warmth = buildAxisDirection('warmth', anchorVectors)

  return {
    weight: weight && withFittedScale(weight, 'weight', anchorVectors),
    energy: energy && withFittedScale(energy, 'energy', anchorVectors),
    warmth: warmth && withFittedScale(warmth, 'warmth', anchorVectors)
  }
}

/**
 * Fit a scale factor for one axis direction by checking the
 * average ratio between each anchor's known axis value and its
 * raw (unscaled) projection onto the direction vector. This is
 * a simple least-squares-style fit through the origin.
 */
function withFittedScale(
  direction: AxisDirection,
  axis: 'weight' | 'energy' | 'warmth',
  anchorVectors: Map<string, RawVector>
): AxisDirection {
  let numerator = 0
  let denominator = 0

  for (const anchor of CALIBRATION_ANCHORS) {
    const known = anchor.mood[axis]
    if (known === 0) continue

    const vec = anchorVectors.get(anchor.word)
    if (!vec) continue

    const rawProjection = dot(vec, direction.vector) / direction.norm
    numerator += known * rawProjection
    denominator += rawProjection * rawProjection
  }

  const fittedScale = denominator > 0 ? numerator / denominator : 1

  return { ...direction, scale: fittedScale }
}

function clamp(n: number, min = -1, max = 1): number {
  return Math.max(min, Math.min(max, n))
}

/**
 * Score a single word's raw GloVe vector against the calibrated
 * axis directions, producing a MoodVector. Each axis uses its
 * own fitted scale (set during buildCalibration) rather than a
 * single global constant, since different axes and different
 * embedding sources can have very different raw projection
 * magnitudes.
 */
export function scoreVector(
  vector: RawVector,
  calibration: Calibration
): MoodVector {
  const score = (direction: AxisDirection | null): number => {
    if (!direction) return 0
    const rawProjection = dot(vector, direction.vector) / direction.norm
    const scaled = rawProjection * (direction.scale ?? 1)
    return clamp(scaled)
  }

  return {
    weight: score(calibration.weight),
    energy: score(calibration.energy),
    warmth: score(calibration.warmth)
  }
}
