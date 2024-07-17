import { Trackers, createTracker } from '@libhub/utils'
import type { TrackerEventMap } from './event-type'

export * from './hooks'

export const gaTracker = createTracker('googleAnalytics', 'G-WGEKZ697DT')
// export const mixpanelTracker = createTracker('mixpanel', 'xx')

export const trackers = new Trackers<TrackerEventMap>([gaTracker])
