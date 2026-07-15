# EM2 Theorems Visual Studio

An interactive React + Tailwind single-page app for understanding the Big Three Vector Calculus theorems:

- Green's Theorem (2D circulation vs curl)
- Stokes' Theorem (3D boundary circulation vs curl flux)
- Gauss' Divergence Theorem (closed-surface flux vs volume divergence)

## Features

- Split-screen learning layout (40% guide + 60% simulation)
- Dark/light mode toggle
- KaTeX-rendered equations
- Interactive 2D canvas for Green's theorem with draggable boundary loop
- Interactive 3D scenes (Three.js via `@react-three/fiber`) for Stokes and Gauss modules
- Real-time numerical readouts that track theorem equality

## Run locally

```bash
npm install
npm run dev
```

## Build and lint

```bash
npm run lint
npm run build
```
