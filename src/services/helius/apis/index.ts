import { heliusRequest } from '../request'
import type { HeliusListReq } from '../types'
import type { ITransaction } from './types'

export * from './types'

export async function getTXHistoryApi({ address, ...rest }: { address: string } & HeliusListReq) {
  return heliusRequest.get<ITransaction[]>(`/addresses/${address}/transactions`, { type: 'TRANSFER', ...rest })
}
