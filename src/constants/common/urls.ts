export const ETHERSCAN_HOST_MAP: Record<number, string> = {
  1: 'https://etherscan.io',
  56: 'https://bscscan.com',
  11155111: 'https://sepolia.etherscan.io',
}
export const resourceUrls = {
  app: import.meta.env.VITE_APP_URL,
  gitbook: '',
  x: 'https://x.com/getsolrent',
  discord: '',
  medium: 'https://medium.com/@GetSolRent',
  tg: '',
} as const
