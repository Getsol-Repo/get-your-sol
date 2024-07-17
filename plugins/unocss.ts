import { type Preset, toEscapedSelector } from 'unocss'

export function presetBase(): Preset {
  return {
    name: 'base',
    rules: [
      [
        /^truncate-(\d+)$/,
        ([_, d]) => {
          return {
            '-webkit-box-orient': 'vertical',
            '-webkit-line-clamp': d,
            display: '-webkit-box',
            overflow: 'hidden',
            'word-break': 'break-all',
          }
        },
      ],
      [
        /^no-tap-highlight$/,
        () => ({
          '-webkit-tap-highlight-color': 'transparent',
        }),
      ],
      [
        /^animation-delay-(\d+)$/,
        ([_, d]) => ({
          'animation-delay': `${d}ms`,
        }),
      ],
      [
        /^animation-duration-(\d+)$/,
        ([_, d]) => ({
          'animation-duration': `${d}ms`,
        }),
      ],
      [
        /^expand-click-area-(\d+)$/,
        ([, size], { rawSelector }) => {
          const selector = toEscapedSelector(rawSelector)
          const dimension = `-${Number(size) * 4}px`
          return `
        ${selector} {
          position: relative;
        }
        ${selector}::before {
          content: "";
          position: absolute;
          top: ${dimension};
          right: ${dimension};
          bottom: ${dimension};
          left: ${dimension};
        }
      `
        },
      ],
      [/^gradient-text/, () => ({
        'background-clip': 'text',
        '-webkit-background-clip': 'text',
        '-webkit-text-fill-color': 'transparent',
      })],
    ],
    shortcuts: {
      'flex-center': 'flex justify-center items-center',
    },
  }
}
