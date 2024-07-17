import type { StateCreator } from 'zustand'

export const baseStoreState: BaseStoreState = {
  version: 0,
}
type BaseStoreCreatorArgs = Parameters<StateCreator<BaseStoreState & BaseStoreActions>>
export function createBaseStore<T extends Record<string, any>>(initState: T) {
  return (set: BaseStoreCreatorArgs[0], get: BaseStoreCreatorArgs[1]) => ({
    ...baseStoreState,
    ...initState,
    incrementVersion() {
      set({ version: get().version + 1 })
    },
    reset() {
      set({ ...baseStoreState, ...initState })
    },
  })
}
