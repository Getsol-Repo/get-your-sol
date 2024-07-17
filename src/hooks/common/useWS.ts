import { useWebSocket } from 'ahooks'
import { useEffect, useRef } from 'react'
import { WS_HEARTBEAT_INTERVAL } from '@/constants'

type Options<T = any> = Parameters<typeof useWebSocket>[1] & {
  onDataReceive?: (data: T | string, message: WebSocketEventMap['message'], i: WebSocket) => void
}
export function useWS<T = any>(url: string, options?: Options<T>) {
  const { onClose, onDataReceive, onError, onMessage, onOpen } = options || {}
  const timerRef = useRef<NodeJS.Timeout>()

  const stopSendHeartbeat = () => {
    clearTimeout(timerRef.current)
  }
  const sendheartbeat = () => {
    timerRef.current = setTimeout(() => {
      // eslint-disable-next-line ts/no-use-before-define
      sendMessage?.('ping')
      sendheartbeat()
    }, WS_HEARTBEAT_INTERVAL)
  }
  const result = useWebSocket(url, {
    ...options,
    ...{
      onOpen: (e, instance) => {
        sendheartbeat()
        console.log('🚀 ~ ws open', e)
        onOpen?.(e, instance)
      },
      onError: (e, instance) => {
        // console.log('🚀 ~ ws err', e)
        onError?.(e, instance)
        stopSendHeartbeat()
      },
      onClose(e, instance) {
        console.log('🚀 ~ ws close', e)
        onClose?.(e, instance)
        stopSendHeartbeat()
      },
      onMessage: (e, instance) => {
        // console.log('🚀 ~ ws msg', e)
        let data: T | string
        try {
          data = JSON.parse(e.data)
        } catch (err) {
          data = e.data
        }
        onDataReceive?.(data, e, instance)
        onMessage?.(e, instance)
      },
    },
  })
  const { readyState, sendMessage, disconnect, connect } = result

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current)
      disconnect?.()
    }
  }, [])
  return result
}
