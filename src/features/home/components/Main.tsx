import styled from '@emotion/styled'
import { useRequest } from 'ahooks'
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID, createCloseAccountInstruction } from '@solana/spl-token'
import { useState } from 'react'
import { Spin } from 'antd'
import { chunk, isNil } from 'lodash-es'
import BigNumber from 'bignumber.js'
import { useWallet } from '@ant-design/web3-solana'
import { Connector, type ConnectorTriggerProps } from '@ant-design/web3'

import { ResultModal } from './ResultModal'
import { CLOSURE_REFUND_AMOUNT, DECIMAL_PLACES, ENV_VARS, MAX_CLOSE_ACCOUNT_COUNT, connection } from '@/constants'
import type { BaseProps } from '@/types'
import { BaseButton, BaseInput, BaseLink, BaseSvg, CopyToClipboard, useModalManager } from '@/components'
import { useAppStore } from '@/store'
import { useSelector } from '@/hooks'
import { bn, getStaticAssetsUrl } from '@/utils'
import { useRoute } from '@/router'
import { getPhantomProvider, isAddressEqual } from '@/web3'

const StyledInput = styled(BaseInput)({
  '& .ant-input::placeholder': {
    color: '#A796FF',
    opacity: 1,
  },
})
const REFERRAL_KEY = 'ref'
const REFEREAL_FEE = 0.5
const PLATFORM_FEE = 0.2
interface MainProps extends BaseProps {

}

interface ButtonProps extends BaseProps {

}

export function Button(props: ButtonProps & ConnectorTriggerProps) {
  const { onConnectClick, ...rest } = props
  return (
    <div onClick={() => onConnectClick?.()} {...rest} />
  )
}

export function Main(props: MainProps) {
  const { ...rest } = props
  const { address, breakpoints } = useAppStore(useSelector(['address', 'breakpoints']))
  const { lg } = breakpoints
  const route = useRoute()
  const referral = route.query[REFERRAL_KEY]
  const referralAddress = referral
  const [inputAddress, setInputAddress] = useState<string>()

  const wallet = useWallet()
  const { runAsync: query, loading: queryLoading, data, mutate } = useRequest(async (inputAddress: string) => {
    // if (!wallet.publicKey) {
    //   return
    // }
    // await wallet.sendTransaction(await creatTokenAccountTx(wallet.publicKey), connection)
    const owner = new PublicKey(inputAddress)
    const { value } = await connection.getParsedTokenAccountsByOwner(owner, {
      programId: TOKEN_PROGRAM_ID,
    })
    const arr = value.filter((item) => bn(item.account.data.parsed.info.tokenAmount.uiAmount).isZero())
    return arr
  }, { manual: true })

  const totalAmount = !isNil(data) ? bn(data.length).times(CLOSURE_REFUND_AMOUNT).dp(DECIMAL_PLACES.sol, BigNumber.ROUND_DOWN) : undefined
  const claimableAmount = totalAmount?.times(1 - PLATFORM_FEE).dp(DECIMAL_PLACES.sol, BigNumber.ROUND_DOWN)
  const [prevClaimableAmount, setPrevClaimableAmount] = useState<BigNumber>()
  const [prevTokenAccounts, setPrevTokenAccounts] = useState<typeof data>()
  const totalFeeAmount = totalAmount && claimableAmount ? totalAmount.minus(claimableAmount) : undefined
  const referralFeeAmount = referralAddress ? totalFeeAmount?.times(REFEREAL_FEE).dp(DECIMAL_PLACES.sol, BigNumber.ROUND_DOWN) : bn(0)
  const platformFeeAmount = totalFeeAmount && referralFeeAmount ? totalFeeAmount.minus(referralFeeAmount) : undefined
  const resultModal = useModalManager()

  const { runAsync: claim, loading: claimLoading } = useRequest(async () => {
    console.log('🚀 ~ wallet:', wallet)
    resultModal.setOpen(true)
    const provider = getPhantomProvider()
    console.log('🚀 ~ provider:', provider)
    if (!wallet.wallet || !inputAddress || !wallet.publicKey || !platformFeeAmount || !data || !provider) {
    // if (!wallet.wallet || !wallet.publicKey || !provider) {
      return
    }
    const transactions: Transaction[] = []
    // const target = new PublicKey(inputAddress)
    const arr = [...data]
    const { blockhash } = await connection.getRecentBlockhash('max')
    console.log('🚀 ~ blockhash:', blockhash)
    if (referralAddress) {
      // @ts-expect-error
      arr?.push(undefined, undefined)
    } else {
      // @ts-expect-error
      arr?.push(undefined)
    }
    for (const itemArr of chunk(arr, MAX_CLOSE_ACCOUNT_COUNT)) {
      const transaction = new Transaction()
      // transaction?.add(SystemProgram.transfer({
      //   fromPubkey: wallet.publicKey,
      //   toPubkey: new PublicKey('4ZRACauqAG9TsQBUMQkZWAmhER1zvigZm69mRMGSHWpU'),
      //   lamports: bn.toWei(0.00001, 9).toBigInt(), // 20
      // }))
      transaction.feePayer = wallet.publicKey
      transaction.recentBlockhash = blockhash
      itemArr.forEach((item) => {
        // transaction.add(
      //   createCloseAccountInstruction(
      //     target,
      //     wallet.publicKey,
      //     wallet.publicKey,
      //   ),
      // )
        console.log('🚀 ~ item:', item)
        if (item) {
          transaction.add(
            createCloseAccountInstruction(
              item.pubkey,
              wallet.publicKey!,
              wallet.publicKey!,
            ),
          )
        }
      })
      transactions.push(transaction)
    }
    console.log('🚀 ~ transactions:', transactions)

    // transaction.add(SystemProgram.transfer({
    //   fromPubkey: wallet.publicKey,
    //   toPubkey: new PublicKey(ENV_VARS.VITE_PLATFORM_ADDRESS),
    //   lamports: bn.toWei(platformFeeAmount, 9).toBigInt(), // 20
    // }))

    const lastTransaction = transactions.at(-1)!
    if (referralFeeAmount?.gt(0) && referralAddress) {
      lastTransaction.add(SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: new PublicKey(referralAddress),
        lamports: bn.toWei(referralFeeAmount, 9).toBigInt(), // 20
      }))
    }
    lastTransaction.add(SystemProgram.transfer({
      fromPubkey: wallet.publicKey,
      toPubkey: new PublicKey(ENV_VARS.VITE_PLATFORM_ADDRESS),
      lamports: bn.toWei(platformFeeAmount, 9).toBigInt(), // 20
    }))

    // if (transactions.length > 1) {
    //   const txRes = await wallet.signAllTransactions?.(transactions)
    //   if (!txRes) {
    //     return
    //   }

    //   // const signature = await wallet.sendTransaction?.(transaction, connection)
    //   const signatures: string[] = []
    //   for (const tx of txRes) {
    //     // const signature = await wallet.sendTransaction?.(tx, connection)
    //     const signature = await connection.sendTransaction(tx)
    //   // signatures.push(signature)
    //   }
    //   await Promise.all(signatures.map((signature) => connection.confirmTransaction(signature, 'finalized')))
    // } else {
    //   const signature = await wallet.sendTransaction?.(transactions[0], connection)
    //   await connection.confirmTransaction(signature, 'finalized')
    // }
    // await connection.confirmTransaction({ signature }, 'finalized')
    const { signatures } = await provider.signAndSendAllTransactions(transactions)
    console.log('🚀 ~ signatures:', signatures)
    await connection.getSignatureStatuses(signatures)
    setPrevClaimableAmount(claimableAmount)
    setPrevTokenAccounts(data)
    resultModal.setOpen(true)
    mutate(undefined)
  }, { manual: true })

  const bntEl = (
    <Button>
      <BaseButton
        icon={address && <BaseSvg href="logos/phantom" size={24} />}
        loading={queryLoading}
        type="primary"
        onClick={() => {
          // claim()
          // return
          if (!address) {
            return
          }
          setInputAddress(address)
          query(address)
        }}
      >
        {address ? 'Check Your Address' : 'Connect Wallet'}
      </BaseButton>
    </Button>
  )
  const invitationLink = `${location.origin}/?${REFERRAL_KEY}=${address}`

  return (
    <div
      className="lg:() flex flex-1 flex-col"
      style={{
        backgroundImage: `url(${getStaticAssetsUrl('/src/assets/images/bg.png')})`,
        backgroundSize: lg ? '100% 100%' : '1000px 555px',
        backgroundPosition: 'center',
      }}
      {...rest}
    >
      {prevClaimableAmount && prevTokenAccounts && <ResultModal data={{ tokenAccounts: prevTokenAccounts, claimableAmount: prevClaimableAmount }} {...resultModal.props} />}
      <div className="main-content flex flex-1 flex-col items-center pb-55 pt-16">
        <div className="lg:() mb-6 text-center text-4 c-primary">
          Tools on SOLALNA
        </div>
        <div className="lg:() mb-8 max-w-192.75 text-center text-16 c-#2A292E fw-600">
          Would you like to claim your $SOL?
        </div>
        <div className="lg:() mb-12 text-center text-4 c-#2A292E op-50">
          Solana Blockchain keeps you SOL! We give it back to you!
        </div>
        <Spin spinning={queryLoading} wrapperClassName="mb-12 w-full max-w-200 px-5">
          <StyledInput
            className="w-full"
            placeholder="Search address"
            suffix={(
              <BaseSvg
                className="cursor-pointer"
                href="outlined/search"
                size={24}
                onClick={() => {
                  inputAddress && query(inputAddress)
                }}
              />
            )}
            value={inputAddress}
            onChange={(e) => {
              setInputAddress(e.target.value)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                inputAddress && query(inputAddress)
              }
            }}
          />
        </Spin>
        <div className="lg:() max-w-300 w-full">
          <div className="lg:() flex items-start rounded-1.5 bg-[rgba(229,225,255,0.80)] px-5 py-3.5">
            <div className="lg:() flex-1 gap-7.5">
              <div className="lg:() mb-7.5 flex items-center justify-between">
                <div className="lg:() flex flex-1 flex-col gap-2.5 c-primary">
                  <div className="lg:() text-4">
                    Account to Close
                  </div>
                  <div className="lg:() text-6">
                    {data ? data.length : '--'}
                  </div>
                </div>
                <div className="lg:() flex flex-1 flex-col gap-2.5 c-primary">
                  <div className="lg:() text-4">
                    Total SOL to Claim
                  </div>
                  <div className="lg:() text-6">
                    {claimableAmount?.toFormat() || '--'}
                  </div>
                </div>
              </div>
              {isAddressEqual(inputAddress, address) && claimableAmount ? (
                <BaseButton
                  disabled={!claimableAmount || claimableAmount.isZero()}
                  icon={<BaseSvg href="logos/sol" size={24} />}
                  loading={claimLoading}
                  type="primary"
                  onClick={() => {
                    claim()
                  }}
                >
                  Claim Your SOL
                </BaseButton>
              ) : (
                address ? bntEl : <Connector>{bntEl}</Connector>
              )}
            </div>
            <div className="lg:() flex flex-1 flex-col gap-3">
              {[
                {
                  description: '~0.002 SOL for each account',
                  icon: 'outlined/coin',
                },
                {
                  description: 'Fully transparent, requiring only one signature',
                  icon: 'outlined/controls',
                },
                {
                  description: 'Only the accounts have a zero balance and are of no use',
                  icon: 'outlined/financial-cycle',
                },
              ].map((item, index) => (
                <div key={index} className="lg:() flex items-center gap-4">
                  <BaseSvg href={item.icon} size={24} />
                  <div className="lg:() o-50 flex flex-col gap-2.5 text-4 c-primary op-50">
                    {item.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {address && (
            <div className="lg:() mt-6 flex items-center gap-2 px-5">
              <BaseSvg href="filled/referral" size={24} />
              <div className="lg:() flex flex-col">
                <span className="c-#a08ffc">Your invitation link to earn 10% of the service fee:</span>
                <div className="lg:() flex items-center gap-2 c-primary">
                  <BaseLink external text className="break-all c-primary" to={invitationLink}>{invitationLink}</BaseLink>
                  <CopyToClipboard
                    copiedNode={<BaseSvg className="c-#52d686" href="outlined/check" size={24} />}
                    text={invitationLink}
                  >
                    <BaseSvg className="cursor-pointer" href="outlined/copy" size={24} />
                  </CopyToClipboard>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
