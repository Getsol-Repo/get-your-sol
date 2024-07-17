import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { trackers } from '.'
import { buildUUID } from '@/utils/common'
import { useAppStore } from '@/store'
import { useSelector } from '@/hooks'

export function useInitTrackers() {
  const { address } = useAppStore(useSelector(['address']))
  const uuidRef = useRef(sessionStorage.getItem('uuid'))
  const location = useLocation()
  const { search, pathname, hash } = location

  useEffect(() => {
    trackers.init({
      debug: false,
      persistence: 'localStorage',
    })
    if (!uuidRef.current) {
      uuidRef.current = buildUUID()
      sessionStorage.setItem('uuid', uuidRef.current)
    }
  }, [])

  useEffect(() => {
    const page_name = pathname + hash
    trackers.setGlobalParams({
      address,
      anonymizeIp: true,
      page_name,
      referrer: new URLSearchParams(search).get('referrer'),
      sid: uuidRef.current,
      // customBrowserType: !isMobile
      //   ? 'desktop'
      //   : 'web3' in window || 'ethereum' in window
      //   ? 'mobileWeb3'
      //   : 'mobileRegular',
    })
    trackers.pageview({
      page_name,
      page_status: address ? 'Connected' : 'Unconnect',
    })
  }, [search, pathname, hash])
  useEffect(() => {
    // Set this to a unique identifier for the user performing the event.
    address
    && trackers.setPeopleProfile?.({
      name: address,
      uniqueId: address,
    })
  }, [address])
}
