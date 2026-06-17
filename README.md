# tiny-mood

Monorepo for **tiny-mood** — deterministic, mood-driven CSS gradient backgrounds from text.

| Package | npm | Role |
|---|---|---|
| [packages/tinymood](./packages/tinymood) | [`tiny-mood`](https://www.npmjs.com/package/tiny-mood) | Runtime — zero deps, consumes a mood table JSON |
| [packages/tinymood-generate](./packages/tinymood-generate) | [`tiny-mood-generate`](https://www.npmjs.com/package/tiny-mood-generate) | Build-time CLI — scans your content, caches GloVe, writes the table |

## Quick start

```bash
npm install tiny-mood
npm install -D tiny-mood-generate

npx tiny-mood-generate ./content ./mood-table.json
```

```ts
import { getMoodBackground } from 'tiny-mood'
import moodTable from './mood-table.json'

const { background, filter, mood } = getMoodBackground(text, moodTable, seed)
```

See each package's README for full API docs, parameters, and examples.

## Demo (this repo)

```bash
npm run dev
```

Open http://localhost:3456

## Develop

```bash
npm install
npm run build
npm test
```

## License

MIT
