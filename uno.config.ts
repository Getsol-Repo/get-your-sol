import transformerVariantGroup from '@unocss/transformer-variant-group'
import transformerDirective from '@unocss/transformer-directives'
import { defineConfig, presetIcons, presetUno } from 'unocss'
import { presetBase } from './plugins/unocss'

export default defineConfig({
  presets: [presetUno(), presetBase(), presetIcons()],
  rules: [],
  safelist: [],
  shortcuts: {
    'main-content': 'max-w-312 w-full mx-a px-4',
  },
  theme: {
    colors: {
      primary: 'var(--c-primary)',
    },
    breakpoints: {
      xs: '375px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      xxl: '1536px',
    },
  },
  transformers: [transformerVariantGroup(), transformerDirective()],
})
