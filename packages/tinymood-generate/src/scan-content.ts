/**
 * scan-content.ts
 *
 * Reads a directory of blog post JSON files (matching the
 * moatlog blog schema: slug, title, description, sections[]
 * with heading/body) and extracts the set of unique words
 * across all posts. This is the "what words do I actually
 * need vectors for" step.
 */

import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'

interface BlogPostSection {
  heading?: string
  body?: string
}

interface BlogPost {
  slug: string
  title: string
  description?: string
  sections?: BlogPostSection[]
}

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'so', 'if', 'then',
  'when', 'where', 'how', 'what', 'why', 'which', 'who',
  'this', 'that', 'these', 'those', 'my', 'our', 'your', 'its',
  'we', 'i', 'it', 'is', 'are', 'was', 'were', 'be', 'been',
  'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
  'would', 'can', 'could', 'should', 'to', 'of', 'in', 'for',
  'on', 'at', 'by', 'with', 'from', 'as', 'into', 'about'
])

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9'\s-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .filter(w => w.length > 1 && !STOP_WORDS.has(w))
}

function extractTextFromPost(post: BlogPost): string {
  const parts: string[] = [post.title]
  if (post.description) parts.push(post.description)
  for (const section of post.sections ?? []) {
    if (section.heading) parts.push(section.heading)
    if (section.body) parts.push(section.body)
  }
  return parts.join(' ')
}

/**
 * Scan a directory of blog post JSON files and return the set
 * of unique, non-stop-word tokens across all of them.
 */
export function extractVocabulary(contentDir: string): Set<string> {
  const vocabulary = new Set<string>()

  const files = readdirSync(contentDir).filter(f => f.endsWith('.json'))

  for (const file of files) {
    const raw = readFileSync(join(contentDir, file), 'utf8')
    let post: BlogPost
    try {
      post = JSON.parse(raw)
    } catch {
      continue // skip malformed files rather than crashing the whole scan
    }

    const text = extractTextFromPost(post)
    for (const token of tokenize(text)) {
      vocabulary.add(token)
    }
  }

  return vocabulary
}
