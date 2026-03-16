import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  css: {
    devSourcemap: true,
  },
  build: {
    sourcemap: true,
  },
})
