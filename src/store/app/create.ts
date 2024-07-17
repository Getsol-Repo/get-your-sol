import { devtools, persist } from 'zustand/middleware'
import { createWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/shallow'
import { createBaseStore } from '../global'
import { bn } from '@/utils/common'
import type { AddressType } from '@/web3'

export interface AppState {
  address?: AddressType
  tokenPrices: {
    ETHUSDT?: {
      symbol: string
      price: string
    }
  }
  disconnect?: () => void
  blockNumber?: string
  blockNumberIndicatorCollapsed: boolean
  sideDrawerOpen?: boolean
  hoveringAddress?: string
  isLoggedIn: boolean
  breakpoints: Breakpoints
  chainId?: number
}

interface AppActions {
  setTokenPrices: (payload: AppState['tokenPrices']) => void
  setAddress: (payload: AppState['address']) => void
  setDisconnect: (payload: AppState['disconnect']) => void
  setBlockNumber: (payload: AppState['blockNumber']) => void
  fastForward: (update: Required<AppState>['blockNumber']) => void
  setBlockNumberIndicatorCollapsed: (payload: AppState['blockNumberIndicatorCollapsed']) => void
  setSideDrawerOpen: (payload: AppState['sideDrawerOpen']) => void
  setHoveringAddress: (payload: AppState['hoveringAddress']) => void
  setIsLoggedIn: (payload: AppState['isLoggedIn']) => void
  setBreakpoints: (payload: AppState['breakpoints']) => void
  setChainId: (payload: AppState['chainId']) => void
}

export const initAppState: AppState = {
  address: undefined,
  blockNumber: undefined,
  tokenPrices: {},
  blockNumberIndicatorCollapsed: true,
  hoveringAddress: undefined,
  isLoggedIn: false,
  breakpoints: {
    xs: false,
    sm: false,
    md: false,
    lg: false,
    xl: false,
    xxl: false,
  },
  chainId: undefined,
}

export type AppStore = AppState & AppActions & BaseStoreState & BaseStoreActions

export const useAppStore = createWithEqualityFn<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...createBaseStore(initAppState)(set, get),
        fastForward: (update) => {
          const { blockNumber, setBlockNumber } = get()
          if (blockNumber && bn(blockNumber).lt(update)) {
            setBlockNumber(blockNumber)
          }
        },
        setAddress(address) {
          set({ address })
        },
        setBlockNumber(payload) {
          set({ blockNumber: payload })
        },
        setDisconnect(payload) {
          set({ disconnect: payload })
        },
        setTokenPrices(payload) {
          set({ tokenPrices: payload })
        },
        setBlockNumberIndicatorCollapsed(payload) {
          set({ blockNumberIndicatorCollapsed: payload })
        },
        setSideDrawerOpen(payload) {
          set({ sideDrawerOpen: payload })
        },
        setHoveringAddress(payload) {
          set({ hoveringAddress: payload })
        },
        setIsLoggedIn(payload) {
          set({ isLoggedIn: payload })
        },
        setBreakpoints(payload) {
          set({ breakpoints: payload })
        },
        setChainId(payload) {
          set({ chainId: payload })
        },
      }),
      {
        name: 'AppStore',
        version: 1,
        partialize(state) {
          const { hoveringAddress, ...rest } = state
          return rest
        },
      },
    ),
    { name: 'App' },
  ),
  shallow,
)
