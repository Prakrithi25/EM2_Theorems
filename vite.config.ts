import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './', // relative asset paths: works when deployed to any subpath (e.g. GitHub Pages project sites) or opened locally
  plugins: [react()],
})
