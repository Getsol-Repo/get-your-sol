import { resolve } from 'node:path'
import { cwd } from 'node:process'
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import unocss from 'unocss/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import postcssPresetEnv from 'postcss-preset-env'
import { chunkSplitPlugin } from 'vite-plugin-chunk-split'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { cleanNonEssentials } from './plugins/clean'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, cwd())
  console.log(`${mode} mode 🚀`, env)
  return {
    build: {
      // sourcemap:true
      target: 'modules',
      minify: 'esbuild',
      cssTarget: ['chrome87'],
      rollupOptions: {
        output: {
          entryFileNames: `assets/[hash].js`,
          chunkFileNames: `assets/[hash].js`,
          assetFileNames: `assets/[hash].[ext]`,
        },
      },
    },
    define: {
      // global: 'globalThis',
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
      postcss: {
        plugins: [
          postcssPresetEnv({
            stage: 0,
          }),
        ],
      },
    },
    esbuild: { drop: mode === 'production' ? ['console', 'debugger'] : [] },
    plugins: [
      nodePolyfills(),
      react(),
      unocss(),
      chunkSplitPlugin(),
      cleanNonEssentials(),
      createSvgIconsPlugin({
        customDomId: '__svg__icons__dom__',
        iconDirs: [resolve(cwd(), 'src/assets/icons')],
        symbolId: 'icon-[name]',
      }),
    ],
    resolve: {
      alias: [
        {
          find: 'useSelector',
          replacement: './src/hooks/common/useSelector.ts',
        },
        {
          find: /^~/,
          replacement: '',
        },
        {
          find: '@',
          replacement: resolve(__dirname, 'src'),
        },
      ],
    },
    server: {
      host: true,
      port: 2013,
    },
    test: {
      globals: true,
      environment: 'jsdom',
      coverage: {
        provider: 'v8',
      },
    },
  }
})
