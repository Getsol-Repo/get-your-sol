import BigNumber from 'bignumber.js'
import { isBigInt } from '../is'

export type BigNumberValue = BigNumber.Value | bigint

BigNumber.config({ EXPONENTIAL_AT: [-8, 30] })

const applyFunction: Pick<BigNumber, 'toBigInt' | 'toHex'> = {
  toBigInt() {
    return BigInt(this.isNaN() ? 0 : this.toString())
  },
  toHex() {
    const hex = this.dp(0).toString(16)
    if (hex === '0') {
      return '0x'
    }
    return `0x${hex}`
  },
}

Object.assign(BigNumber.prototype, applyFunction)

export interface Bn {
  (tar: BigNumberValue): BigNumber
  fromWei: (tar: BigNumberValue, decimals: BigNumberValue) => BigNumber
  toWei: (tar: BigNumberValue, decimals: BigNumberValue) => BigNumber
}

export const bn: Bn = (val: BigNumberValue) => new BigNumber(isBigInt(val) ? val.toString() : val)

bn.fromWei = (tar: BigNumberValue, decimals: BigNumberValue) => {
  return bn(tar).div(new BigNumber(10).pow(bn(decimals)))
}
bn.toWei = (tar: BigNumberValue, decimals: BigNumberValue) => {
  return bn(tar).times(new BigNumber(10).pow(bn(decimals)))
}
