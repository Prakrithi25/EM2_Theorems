# Field & Flux — Vector Calculus Visualizer

An interactive SPA that teaches **Green's**, **Stokes'**, and **Gauss's (Divergence)** theorems
through live simulation: drag a boundary, deform a surface, or tune a source/sink field, and watch
the two sides of each theorem converge to the same number in real time.

Built with Vite + React + TypeScript + Tailwind CSS v4, KaTeX for equations, and
`@react-three/fiber` + `drei` for the 3D modules.

## Project structure

```
src/
  lib/
    fieldMath2D.ts      -- Green's theorem: field defs, curl, line/area integrals (unit-testable)
    fieldMath3D.ts      -- Stokes' & Gauss's: 3D fields, curl, divergence, surface/volume integrals
  components/
    ModuleLayout.tsx    -- shared split-screen (guide | canvas) layout
    MathPanel.tsx       -- KaTeX equation blocks, section headers, live-readout rows
    TopNav.tsx          -- module switcher + dark mode toggle
    GreensCanvas.tsx    -- 2D <canvas> renderer: field arrows, draggable loop, particle/gears
    Arrow3D.tsx         -- reusable 3D arrow (shaft + cone) for the two 3D modules
    DomeSurface.tsx     -- deformable dome mesh built from a parametrized surface
    StokesScene.tsx     -- Stokes' 3D scene (dome, rim, tangents, normals, field arrows)
    GaussScene.tsx      -- Gauss's 3D scene (sphere, flow particles, cross-section heatmap)
  pages/
    Home.tsx, GreensPage.tsx, StokesPage.tsx, GaussPage.tsx
  theme/ThemeContext.tsx -- dark/light mode, persisted to localStorage
```

The math in `lib/` is pure and framework-free — it's been checked against known analytic results
(e.g. a uniform-rotation field over a radius-2 disk gives circulation = area-curl = 8π ≈ 25.13 on
both sides, matching what the app displays).

## Run it locally

Requires Node.js 18+.

```bash
npm install
npm run dev
```

Open the printed `localhost` URL. Edit any file and the browser hot-reloads.

## Build for production

```bash
npm run build
```

This runs a TypeScript check and outputs static files to `dist/`. Preview the production build
locally with:

```bash
npm run preview
```

## Hosting it (free, easy options)

The app is a fully static site (no backend needed) that outputs to `dist/`, so any static host
works. Three good options, easiest first:

### Option A — Vercel (recommended, ~2 minutes)
1. Push this folder to a GitHub repo.
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the repo.
3. Vercel auto-detects Vite. Framework preset: "Vite". Build command `npm run build`, output
   directory `dist` (should be filled in automatically).
4. Click **Deploy**. You get a live URL immediately, and every future push auto-deploys.

### Option B — Netlify (equally easy)
1. Push to GitHub (or drag-and-drop the `dist/` folder directly onto
   [app.netlify.com/drop](https://app.netlify.com/drop) for an instant one-off deploy, no git
   needed).
2. For git-based continuous deploys: **Add new site → Import an existing project**, build command
   `npm run build`, publish directory `dist`.

### Option C — GitHub Pages (free, tied to a GitHub repo)
1. `npm install -D gh-pages`
2. Add to `package.json` scripts: `"deploy": "npm run build && gh-pages -d dist"`
3. Run `npm run deploy`. Enable Pages in the repo settings (source: `gh-pages` branch).

This app already uses `HashRouter` (URLs look like `/#/greens`), so it works correctly on any of
these hosts — including GitHub Pages — without extra rewrite-rule configuration for client-side
routing.

## Notes on performance

The Stokes' and Gauss's modules (which pull in `three.js`) are lazy-loaded, so the initial page
load only ships the Green's/home bundle. Three.js itself is the largest dependency; this is normal
for any 3D-in-the-browser app and won't noticeably affect load time on a real host with HTTP
compression (Vercel/Netlify/GitHub Pages all gzip/brotli automatically).
