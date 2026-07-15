import { useMemo, useState } from 'react'
import GreenModule from './modules/GreenModule'
import StokesModule from './modules/StokesModule'
import GaussModule from './modules/GaussModule'

const MODULES = [
  {
    id: 'green',
    title: "Green's theorem",
    summary: 'Relates circulation around a planar boundary to curl density over the enclosed region.',
  },
  {
    id: 'stokes',
    title: "Stokes' theorem",
    summary: 'Generalizes Green to 3D surfaces: boundary circulation equals curl flux through the surface.',
  },
  {
    id: 'gauss',
    title: "Gauss' divergence theorem",
    summary: 'Relates total outward flux through a closed shell to net divergence inside the enclosed volume.',
  },
]

function App() {
  const [activeModule, setActiveModule] = useState('green')
  const [darkMode, setDarkMode] = useState(false)

  const ActiveModuleContent = useMemo(() => {
    if (activeModule === 'stokes') {
      return <StokesModule darkMode={darkMode} />
    }
    if (activeModule === 'gauss') {
      return <GaussModule darkMode={darkMode} />
    }
    return <GreenModule darkMode={darkMode} />
  }, [activeModule, darkMode])

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
        <header className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold md:text-3xl">Vector Calculus Theorem Studio</h1>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Interactive intuition builder for second-year engineering students.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setDarkMode((current) => !current)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700"
              aria-label="Toggle dark mode"
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </header>

        <main className="mx-auto grid w-full max-w-[1500px] gap-6 p-6 lg:grid-cols-[40%_60%]">
          <aside className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-semibold">Guided Learning Panel</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Pick a theorem, connect every term in the equation with a visual object, and verify numerically that both sides match.
            </p>

            <nav className="space-y-2">
              {MODULES.map((module) => (
                <button
                  key={module.id}
                  type="button"
                  onClick={() => setActiveModule(module.id)}
                  className={`w-full rounded-xl border p-3 text-left transition ${
                    activeModule === module.id
                      ? 'border-violet-500 bg-violet-100 dark:bg-violet-950/60'
                      : 'border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800'
                  }`}
                >
                  <p className="font-medium">{module.title}</p>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{module.summary}</p>
                </button>
              ))}
            </nav>

            <div className="rounded-xl bg-slate-100 p-4 text-sm dark:bg-slate-800">
              <p className="font-semibold">How to study each theorem</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>Read the equation term-by-term.</li>
                <li>Manipulate the field and geometry controls.</li>
                <li>Compare the two integral readouts in real time.</li>
                <li>Use the visual toggles to isolate circulation, flux, and curl effects.</li>
              </ul>
            </div>
          </aside>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            {ActiveModuleContent}
          </section>
        </main>
      </div>
    </div>
  )
}

export default App
