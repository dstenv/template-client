import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImportConfig from 'unplugin-auto-import/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import DefineOptions from 'unplugin-vue-define-options/vite'
import path from 'path'
// import unocss from 'unocss/vite'
// import { presetUno, presetAttributify, presetIcons } from 'unocss'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    // unocss({
    //     presets: [presetUno(), presetAttributify(), presetIcons()],
    // }),
    AutoImportConfig({
      imports: ['vue', 'vue-router'],
      dts: 'src/auto-import.d.ts',
    }),
    createSvgIconsPlugin({
      // 要缓存的图标文件夹
      iconDirs: [path.resolve(__dirname, 'src/assets/svg')],
      // 执行 icon name 的格式
      symbolId: 'icon-[name]',
    }),
    DefineOptions(),
  ],

  server: {
    port: 5175,
    proxy: {
      '/api': {
        changeOrigin: true,
        // TODO 解决本地开发跨域，此处可替换为你项目实际的请求路径
        target: 'http://localhost:3000/',
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  base: process.env.NODE_ENV === 'production' ? './' : '/',
})
