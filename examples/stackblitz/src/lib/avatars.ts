export interface AvatarPersona {
  slug: string
  name: string
  title: string
  bio: string
}

export const avatarPersonas: AvatarPersona[] = [
  {
    slug: 'alex-chen',
    name: 'Alex Chen',
    title: 'Senior Engineer',
    bio: 'Builds secure infrastructure and writes about the bugs that teach the most.',
  },
  {
    slug: 'maya-johnson',
    name: 'Maya Johnson',
    title: 'Product Designer',
    bio: 'Calm interfaces, honest copy, and gradients that feel like the product.',
  },
  {
    slug: 'jordan-rivera',
    name: 'Jordan Rivera',
    title: 'Community Lead',
    bio: 'Welcome journeys, story nights, and the fun of simple honest sharing.',
  },
  {
    slug: 'sam-park',
    name: 'Sam Park',
    title: 'Security Engineer',
    bio: 'Regulatory governance, audits, and middleware that has to never fail.',
  },
  {
    slug: 'riley-zhang',
    name: 'Riley Zhang',
    title: 'Data Engineer',
    bio: 'Metrics benchmarks, pipeline deploy logs, and technical data reviews.',
  },
  {
    slug: 'morgan-lee',
    name: 'Morgan Lee',
    title: 'Founder',
    bio: 'Fast launches, enterprise acquisitions, and the excitement of something new.',
  },
]
