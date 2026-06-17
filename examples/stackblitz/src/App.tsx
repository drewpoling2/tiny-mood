import { DemoPlayground } from './components/DemoPlayground'

export function App() {
  return (
    <main className="page">
      <header className="page-header">
        <p className="eyebrow">tiny-mood</p>
        <h1>Blog cards with mood backgrounds</h1>
        <p className="lede">
          Each cover is generated deterministically from the post title and
          description — no images, no LLM, just a word table and OKLCH math.
          Toggle brand colors below to clamp every card to your palette.
        </p>
      </header>

      <DemoPlayground />
    </main>
  )
}
