import type { ReactNode } from 'react'
import type { BaseProps } from '@/types'
import { BaseLink } from '@/components'
import { getStaticAssetsUrl } from '@/utils'

interface ItemProps extends BaseProps {
  title: string
  desc: ReactNode
}

export function Item(props: ItemProps) {
  const { title, desc, ...rest } = props
  return (
    <div
      className="flex flex-1 flex-col gap-5 rounded-4 bg-#E5E1FF px-5 py-7.5 text-center c-#2A292E"
      style={{
        backgroundImage: `url(${getStaticAssetsUrl('/src/features/home/assets/images/line.png')})`,
        backgroundSize: '100% 100%',
      }}
    >
      <div className="lg:() text-6 fw-500">
        {title}
      </div>
      <div className="lg:() text-4 fw-400">
        {desc}
      </div>
    </div>
  )
}

interface FAQProps extends BaseProps {

}

export function FAQ(props: FAQProps) {
  const { ...rest } = props
  return (
    <div className="main-content pb-12.5">
      <div className="lg:() mb-12 text-center text-10 c-#2A292E">
        FAQ
      </div>
      <div className="lg:() flex items-stretch gap-7.5">
        <Item
          desc={(
            <>
              Everytime you receive a NFT in your wallet a specific token account is created for it.
              When you send or sell that NFT to someone else, the token account has 0 units of the NFT but still lingers in your wallet with no utility. <br />
              To create each and single one of those accounts someone paid ~0.002 SOL for rent that is withheld by Solana Network forever, unless we do something about it!
            </>
          )}
          title="Closing SPL Token Accounts"
        />
        <Item
          desc={(
            <>
              All the token accounts that show up for selection already have 0 NFTs assigned and have no use, feel secure in selecting as many as you want and let us do the work.
              The selected tokens accounts are closed and the released rent deposits are sent to you, we take a small fee from profits to keep this Site + RPC running and developing more tools.
            </>
          )}
          title="Claim Your SOL"
        />
        <Item
          desc={(
            <>
              Solana currently charges users 2 years worth of rent for every account created to storage, maintain the data and process transactions with those accounts.
              You can find more information in the official Solana Documentation, link <BaseLink external text className="c-#2A292E fw-700" to="https://solana.com/docs/core/accounts#rent">here</BaseLink>.
            </>
          )}
          title="What is this rent?"
        />
      </div>
    </div>
  )
}
