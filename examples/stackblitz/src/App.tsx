import { DemoPlayground } from './components/DemoPlayground'

export function App() {
  return (
    <div className="app">
      <header className="site-header">
        <div className="site-header-text">
          <p className="eyebrow">tiny-mood</p>
          <h1>Mood-driven backgrounds from text</h1>
          <p className="lede">
            Pass in your brand colors and any text — a post, a caption, a commit
            message. tiny-mood reads the text&apos;s tone and returns a background
            that matches it, clamped to your colors.
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
