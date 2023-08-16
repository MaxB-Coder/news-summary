import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    testMatch: ['./tests/**/*.test.jsx'],
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
    },
    globals: true
  }
})
