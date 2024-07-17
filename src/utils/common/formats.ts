import type BigNumber from 'bignumber.js'
import { type BigNumberValue, bn } from './bn'

export function formatValue(
  value: BigNumberValue,
  decimalPlaces = 2,
  roundingMode?: BigNumber.RoundingMode,
): string {
  const currentValue = bn(value)
  const isBelowOneWithNoDecimal = decimalPlaces === 0 && currentValue.lt(1)
  const threshold = 1 / 10 ** (isBelowOneWithNoDecimal ? 2 : decimalPlaces)
  if (!currentValue.isZero() && currentValue.lt(threshold)) {
    return `<${threshold}`
  }

  return currentValue.dp(isBelowOneWithNoDecimal ? 2 : decimalPlaces, roundingMode).toFormat()
}

export function formatTime(milliseconds: number) {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  const secondsLeft = seconds - minutes * 60
  const minutesLeft = minutes - hours * 60
  return {
    hours: hours.toString().padStart(2, '0'),
    minutes: minutesLeft.toString().padStart(2, '0'),
    seconds: secondsLeft.toString().padStart(2, '0'),
  }
}

export function formatNumber(_num: number | string): string {
  const num = typeof _num === 'string' ? Number(_num) : _num
  if (num >= 1e12) {
    return `${num / 1e12}T`
  }
  if (num >= 1e9) {
    return `${num / 1e9}B`
  }
  if (num >= 1e6) {
    return `${num / 1e6}M`
  }
  if (num >= 1e3) {
    return `${num / 1e3}K`
  }
  return num.toString()
}
