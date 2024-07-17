import type { FormRule } from 'antd'
import { bn } from '../common/bn'

export const mustGreaterThanZeroRule: FormRule = {
  required: true,
  async validator(rule, value) {
    if (!value && value !== 0) {
      return Promise.reject(new Error('The input box cannot be empty'))
    }
    if (bn(value).lte(0)) {
      return Promise.reject(new Error('The input number must be greater than 0'))
    }
  },
}
