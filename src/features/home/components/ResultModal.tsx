import BigNumber from 'bignumber.js'
import { BaseModal, type BaseModalProps, useModalLifecycle } from '@/components'
import { bn } from '@/utils'
import { DECIMAL_PLACES } from '@/constants'

interface ResultModalProps extends BaseModalProps {
  data: {
    tokenAccounts: any[]
    claimableAmount: BigNumber
  }
}

export function ResultModal(props: ResultModalProps) {
  useModalLifecycle(props, { onOpen() {} })
  const { data: { tokenAccounts, claimableAmount }, ...rest } = props

  return (
    <BaseModal
      hideCancelButton
      title={(
        <div className="lg:() text-4.5 c-primary">
          🎉 Claim Successful!
        </div>
      )}
      width={640}
      {...rest}
    >
      <div className="lg:() my-10 text-4.5 c-#2A292E fw-400">
        {bn(tokenAccounts.length).toFormat()} token accounts have been closed and {bn(claimableAmount).dp(DECIMAL_PLACES.sol, BigNumber.ROUND_DOWN).toFormat()} SOL has been successfully claimed. The retained balance from your account creation fees is now available in your wallet.
        <br />
        <br />
        Thank you for using our service! Happy trading on Solana! 🚀
      </div>
    </BaseModal>
  )
}
