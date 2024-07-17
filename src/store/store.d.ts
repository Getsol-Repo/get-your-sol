interface BaseStoreState {
  version: number
}
interface BaseStoreActions {
  incrementVersion: () => void
  reset: () => void
}
