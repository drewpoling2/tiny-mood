export interface CommitEntry {
  slug: string
  hash: string
  message: string
  author: string
  ago: string
}

export const commitEntries: CommitEntry[] = [
  {
    slug: 'fix-auth-middleware',
    hash: 'a3f9c2',
    message: 'fix: resolve critical security vulnerability in auth middleware',
    author: 'Alex Chen',
    ago: '2m ago',
  },
  {
    slug: 'feat-mood-backgrounds',
    hash: 'b7e1d4',
    message: 'feat: add mood-driven gradient backgrounds from text',
    author: 'Maya Johnson',
    ago: '18m ago',
  },
  {
    slug: 'docs-readme-palettes',
    hash: 'c2a8f0',
    message: 'docs: update brand palette descriptions in README',
    author: 'Jordan Rivera',
    ago: '1h ago',
  },
  {
    slug: 'chore-regenerate-table',
    hash: 'd4b3e9',
    message: 'chore: regenerate mood table from expanded content vocabulary',
    author: 'Riley Zhang',
    ago: '3h ago',
  },
  {
    slug: 'perf-compose-blur',
    hash: 'e8c1a2',
    message: 'perf: scale blur ceiling for spiral blend intensity',
    author: 'Sam Park',
    ago: '5h ago',
  },
  {
    slug: 'fix-quiet-post-neutral',
    hash: 'f1d7b3',
    message: 'fix: prevent falsely neutral scores for calm vocabulary',
    author: 'Morgan Lee',
    ago: '1d ago',
  },
]
