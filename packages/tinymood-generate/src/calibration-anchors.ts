/**
 * calibration-anchors.ts
 *
 * Reference words with hand-assigned MoodVector axis values
 * (carried over directly from the v1 hand-curated lexicon).
 * These anchors are used to calibrate the abstract GloVe vector
 * space into the three human-readable axes (weight/energy/warmth)
 * via axis projection — see calibrate.ts.
 *
 * This is what lets us reuse all the design judgment already
 * encoded in the v1 lexicon, rather than throwing it away when
 * moving to real embeddings. The anchors ARE the v1 lexicon;
 * GloVe just lets us generalize from these known words to any
 * word GloVe has seen, via vector-space proximity.
 */

import type { MoodVector } from './types.js'

export interface AnchorWord {
  word: string
  mood: MoodVector
}

export const CALIBRATION_ANCHORS: AnchorWord[] = [
  { word: 'launch', mood: { energy: 0.6, warmth: 0.2, weight: 0 } },
  { word: 'ship', mood: { energy: 0.6, warmth: 0, weight: 0 } },
  { word: 'fast', mood: { energy: 0.5, warmth: 0, weight: 0 } },
  { word: 'announcing', mood: { energy: 0.5, warmth: 0.3, weight: 0 } },

  { word: 'quiet', mood: { energy: -0.6, warmth: 0, weight: 0.1 } },
  { word: 'calm', mood: { energy: -0.6, warmth: 0, weight: 0 } },
  { word: 'gentle', mood: { energy: -0.5, warmth: 0.4, weight: 0.3 } },

  { word: 'architecture', mood: { weight: -0.4, energy: -0.2, warmth: 0 } },
  { word: 'schema', mood: { weight: -0.4, energy: -0.2, warmth: 0 } },
  { word: 'infrastructure', mood: { weight: -0.4, energy: -0.2, warmth: 0 } },
  { word: 'problem', mood: { weight: -0.3, energy: -0.1, warmth: 0 } },
  { word: 'error', mood: { weight: -0.3, warmth: -0.2, energy: 0.2 } },
  { word: 'bug', mood: { weight: -0.2, energy: 0.1, warmth: 0 } },

  { word: 'fun', mood: { weight: 0.5, warmth: 0.3, energy: 0.2 } },
  { word: 'simple', mood: { weight: 0.3, energy: -0.1, warmth: 0 } },
  { word: 'delight', mood: { weight: 0.5, warmth: 0.4, energy: 0.2 } },

  { word: 'welcome', mood: { warmth: 0.5, energy: 0.1, weight: 0 } },
  { word: 'community', mood: { warmth: 0.5, energy: 0, weight: 0 } },
  { word: 'journey', mood: { warmth: 0.3, energy: 0.1, weight: 0 } },
  { word: 'honest', mood: { warmth: 0.3, weight: -0.1, energy: 0 } },

  { word: 'technical', mood: { warmth: -0.3, weight: -0.2, energy: 0 } },
  { word: 'data', mood: { warmth: -0.3, energy: 0, weight: 0 } },
  { word: 'metrics', mood: { warmth: -0.3, energy: 0.1, weight: 0 } },
  { word: 'benchmark', mood: { warmth: -0.3, energy: 0.1, weight: 0 } },

  { word: 'release', mood: { energy: 0.3, weight: 0.1, warmth: 0 } },
  { word: 'milestone', mood: { energy: 0.3, warmth: 0.2, weight: 0 } },
  { word: 'update', mood: { energy: 0.2, warmth: 0, weight: 0 } }
]
