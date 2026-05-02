import uniHelper from '@uni-helper/eslint-config'
import vue from "eslint-plugin-vue"

export default [
  {
    files: ["**/*.vue", "**/*.js", "**/*.ts"],
    plugins: {
      vue
    },
    rules: {
      "vue/html-indent": ["error", 2],
      "vue/max-attributes-per-line": "off"
    }
  }
]

export default uniHelper()
