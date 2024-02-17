import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import alias from '@rollup/plugin-alias'
import { resolve } from 'path'

const rootDir = resolve(__dirname)

export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    alias({
      entries: [
        {
          find: '@',
          replacement: resolve(rootDir, './src')
        },
        {
          find: '@img',
          replacement: resolve(rootDir, './src/assets/img')
        }
      ]
    })
  ]
})
