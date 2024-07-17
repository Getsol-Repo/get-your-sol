import { Cache } from '../common'
import type { AddressType, Token } from '@/web3'

export const appCache = new Cache<{ 'page-size': Record<string, number> }>()
export const tokensCache = new Cache<Record<string, Record<AddressType, Token>>>({ namespace: 'tokens' })

export const sessionCache = new Cache({ storage: sessionStorage })
