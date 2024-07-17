import 'bignumber.js'

declare module 'bignumber.js' {
  interface BigNumber {
    toBigInt: (this: BigNumber) => bigint
    toHex: (this: BigNumber) => `0x${string}`
  }
}
