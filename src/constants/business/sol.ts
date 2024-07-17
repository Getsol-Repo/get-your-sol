import { Connection } from '@solana/web3.js'

export const connection = new Connection(
  `https://helius-api-proxy.takitaki.space`,
  'confirmed',
)

export const CLOSURE_REFUND_AMOUNT = 0.00203928

export const MAX_CLOSE_ACCOUNT_COUNT = 23
