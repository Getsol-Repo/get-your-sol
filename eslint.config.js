import antfu from '@antfu/eslint-config'

export default antfu(
  {
    stylistic: {
      overrides: {
        'style/jsx-self-closing-comp': ['error'],
        'style/quote-props': ['error', 'as-needed'],
        'style/brace-style': ['error', '1tbs'],
        'style/arrow-parens': ['error', 'always'],
        // '@stylistic/js/space-in-parens': 'off',
        'style/jsx-one-expression-per-line': ['off', { allow: 'literal' }],
        // 'style/jsx-closing-tag-location': 'off',
        'style/indent': ['error', 2],
        'style/multiline-ternary': 'off',
        'style/jsx-sort-props': ['error', {
          callbacksLast: true,
          ignoreCase: true,
          multiline: 'ignore',
          noSortAlphabetically: false,
          reservedFirst: true,
          shorthandFirst: true,
          shorthandLast: false,
        }],
      },
    },
    typescript: {
      overrides: {
        'ts/ban-ts-comment': [
          'error',
          {
            minimumDescriptionLength: 3,
            'ts-check': false,
            'ts-expect-error': false,
            'ts-ignore': false,
            'ts-nocheck': false,
          },
        ],
        'ts/consistent-type-assertions': 'off',
        // FIXME: doesn't work
        // 'ts/naming-convention': ['error', {
        //   selector: 'default',
        //   format: ['camelCase'],
        //   leadingUnderscore: 'allow',
        // }, {
        //   selector: ['variable', 'function', 'import'],
        //   // Specify PascalCase for React components
        //   format: ['PascalCase', 'camelCase'],
        //   leadingUnderscore: 'allow',
        // }, {
        //   selector: 'parameter',
        //   format: ['camelCase'],
        //   leadingUnderscore: 'allow',
        // }, {
        //   selector: 'property',
        //   format: null,
        //   leadingUnderscore: 'allow',
        // }, {
        //   selector: 'typeLike',
        //   format: ['PascalCase'],
        // }],
        'import/no-duplicates': ['warn', { considerQueryString: true, 'prefer-inline': true }],
      },
    },
    react: {
      overrides: {
        // TODO: 可能是react-hooks没兼容eslint 9 所以打开会报错
        'react-hooks/exhaustive-deps': 'off',
        // 'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
        // 'react/display-name': 'off',
        // 'react/prop-types': 'off',
        // 'react/no-unstable-nested-components': ['error'],
        'react/no-array-index-key': 'off',
        'react-dom/no-dangerously-set-innerhtml': 'off',
      },
    },
    unocss: true,
    formatters: {
      /**
       * Format CSS, LESS, SCSS files, also the `<style>` blocks in Vue
       * By default uses Prettier
       */
      css: true,
      /**
       * Format HTML files
       * By default uses Prettier
       */
      html: true,
      /**
       * Format Markdown files
       * Supports Prettier and dprint
       * By default uses Prettier
       */
      markdown: 'prettier',
    },
  },
  {
    name: 'overrides',
    rules: {
      curly: ['error', 'all'],
      'no-console': 'off',
      'no-useless-return': 'off',
      'node/prefer-global/buffer': ['error', 'always'],
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': 'off',
      'antfu/if-newline': 'error',
    },
  },
)
