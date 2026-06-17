export interface NewsletterIssue {
  slug: string
  publication: string
  issue: string
  title: string
  description: string
}

export const newsletterIssues: NewsletterIssue[] = [
  {
    slug: 'fw-234-css-renaissance',
    publication: 'FRONTEND WEEKLY',
    issue: '#234',
    title: 'The Great CSS Renaissance',
    description: 'Container queries, cascade layers, and why 2026 feels different.',
  },
  {
    slug: 'fw-233-performance',
    publication: 'FRONTEND WEEKLY',
    issue: '#233',
    title: 'The Performance Deep Dive',
    description: 'Profiling stories from teams who cut LCP in half.',
  },
  {
    slug: 'fw-232-burnout',
    publication: 'FRONTEND WEEKLY',
    issue: '#232',
    title: 'On Burnout and Recovery',
    description: 'Quiet reflections on pace, rest, and sustainable craft.',
  },
  {
    slug: 'ds-041-design-systems',
    publication: 'DESIGN SIGNAL',
    issue: '#41',
    title: 'Tokens That Actually Ship',
    description: 'From Figma variables to production without the drift.',
  },
  {
    slug: 'ds-040-accessibility',
    publication: 'DESIGN SIGNAL',
    issue: '#40',
    title: 'Accessibility as a Mood',
    description: 'Calm, inclusive interfaces and the language that builds them.',
  },
  {
    slug: 'pl-118-launch-notes',
    publication: 'PRODUCT LEDGER',
    issue: '#118',
    title: 'Launch Notes From the Trenches',
    description: 'Fast releases, regulatory gates, and honest postmortems.',
  },
]
