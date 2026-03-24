import { defineConfig } from 'vite'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    federation({
      name: 'mfe_angular_counter',
      filename: 'remoteEntry.js',
      exposes: {
        './CounterWidget': './src/CounterWidget.js',
      },
      shared: [],
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  // Change 'erickcguz' to your actual GitHub username
  base: 'https://erickcguz.github.io/mfe-angular-counter/dist/',
})
