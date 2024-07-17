export type AddressType = `0x${string}`
export interface Token {
  address: AddressType
  chainId: number
  decimals: number
  name: string
  symbol: string
}
export interface ContractDicData {
  symbol: string
  [chainId: number]: {
    address: AddressType
    chinId: number
  }
}

export interface UseContractArgs {
  address?: AddressType
  chainId?: number
}
