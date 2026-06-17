import { DemoPlayground } from './components/DemoPlayground'

export function App() {
  return (
    <div className="app">
      <header className="site-header">
        <div className="site-header-text">
          <p className="eyebrow">tiny-mood</p>
          <h1>Mood-driven backgrounds from text</h1>
          <p className="lede">
            No images, no LLM, no network. A word table and OKLCH math — the same
            text always produces the same gradient.
          </p>
        </div>
        <div className="site-header-links">
          <a
            className="header-link"
            href="https://www.npmjs.com/package/tiny-mood"
            target="_blank"
            rel="noreferrer"
          >
            npm
          </a>
          <a
            className="header-link"
            href="https://github.com/drewpoling2/tiny-mood"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </header>

      <DemoPlayground />
    </div>
  )
}
