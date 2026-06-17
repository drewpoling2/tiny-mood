export interface PodcastEpisode {
  slug: string
  show: string
  episode: string
  title: string
  description: string
}

export const podcastEpisodes: PodcastEpisode[] = [
  {
    slug: 'ep-142-joy-open-source',
    show: 'THE DEV POD',
    episode: 'EP 142',
    title: 'The Joy of Open Source',
    description: 'Why contributing back matters more than the code itself.',
  },
  {
    slug: 'ep-089-scaling-infra',
    show: 'PLATFORM STORIES',
    episode: 'EP 89',
    title: 'Scaling Infrastructure Under Pressure',
    description: 'A launch week war story with lessons that stuck.',
  },
  {
    slug: 'ep-031-mindful-shipping',
    show: 'CALM CODE',
    episode: 'EP 31',
    title: 'Mindful Shipping: Calm Amid Chaos',
    description: 'Slowing down to ship faster — counterintuitive but true.',
  },
  {
    slug: 'ep-077-regulatory-deep',
    show: 'COMPLIANCE CAST',
    episode: 'EP 77',
    title: 'Regulatory Deep Dive',
    description: 'Governance, audits, and the words that change your roadmap.',
  },
  {
    slug: 'ep-015-community-welcome',
    show: 'THE DEV POD',
    episode: 'EP 15',
    title: 'Community Welcome Night',
    description: 'Honest stories from first-time contributors.',
  },
  {
    slug: 'ep-204-fast-launch',
    show: 'SHIP IT',
    episode: 'EP 204',
    title: 'Fast Launch, Quiet Morning After',
    description: 'The emotional arc of release day — excitement to reflection.',
  },
]
