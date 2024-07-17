import { type FC, useEffect, useLayoutEffect, useState } from 'react'
import clsx from 'clsx'
import { ConnectButton, type ConnectButtonProps, Connector, type ConnectorTriggerProps, useAccount, useConnection } from '@ant-design/web3'

import type { BaseButtonProps } from './'
import { useAppStore } from '@/store'
import { useBreakpoints, useSelector } from '@/hooks'

import type { BaseProps } from '@/types'

interface ButtonProps extends BaseProps {

}

export function Button(props: ConnectorTriggerProps & ConnectButtonProps) {
  console.log('🚀 ~ props:', props)
  const { ...rest } = props
  return (
    <ConnectButton
      className={clsx()}
      profileModal={{ children: <div>Profile</div> }}
      {...rest}
    />
  )
}

interface ConnectWalletButtonProps extends BaseButtonProps {}
export const ConnectWalletButton: FC<ConnectWalletButtonProps> = ({ className, ...rest }) => {
  const { setAddress, setDisconnect, setSideDrawerOpen, setIsLoggedIn, isLoggedIn } = useAppStore(useSelector(['setAddress', 'setDisconnect', 'setSideDrawerOpen', 'setIsLoggedIn', 'isLoggedIn']))
  const [popoverOpen, setPopoverOpen] = useState(false)
  // const { disconnect } = useDisconnect()
  const { connect, disconnect } = useConnection()
  // const { reconnect } = useReconnect()
  useEffect(() => {
    setDisconnect(disconnect)
  }, [disconnect])
  const { account } = useAccount()

  useLayoutEffect(() => {
    setAddress(account?.address)
    setIsLoggedIn(!!account?.address)
  }, [account])
  const { lg } = useBreakpoints()

  return (
    <Connector>
      <Button />
    </Connector>
  )
}
