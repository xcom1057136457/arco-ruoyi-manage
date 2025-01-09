// eslint.config.mjs
import antfu from '@antfu/eslint-config'

export default antfu({
  unocss: true,
  rules: {
    'node/prefer-global/process': 'off',
    'import/no-self-import': 'off',
    'array-callback-return': 'off',
    'vue/no-reserved-component-names': 'off',
    'prefer-promise-reject-errors': 'off',
  },
})
