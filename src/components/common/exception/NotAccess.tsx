import { Result } from 'antd'
import { HttpStatus } from '@/constants'

export function NotAccess() {
  return <Result status={HttpStatus.FORBIDDEN} title={HttpStatus.FORBIDDEN} />
}
