import { BaseLink, BaseSvg, ConnectWalletButton } from '@/components'
import { resourceUrls } from '@/constants'
import { useBreakpoints } from '@/hooks'

export function Header() {
  const { lg, xl } = useBreakpoints()

  return (
    <header className="sticky top-0 z-20 h-[var(--h-header)] flex flex-shrink-0 items-center of-y-hidden bg-white/75 px-4 c-#fff backdrop-blur transition-all-200 lg:(px-12)">
      <BaseLink className="flex items-center gap-2 text-6" to="/">
        <img alt="" className="h-8.5 w-8.5" src="/favicon.png" />
        <span className="c-primary fw-500">GetSolRent</span>
      </BaseLink>
      <div className="lg:() ml-a flex items-center gap-5">
        <ConnectWalletButton className="" />
        <BaseLink external to={resourceUrls.x}><BaseSvg href="logos/x" size={30} /></BaseLink>
        {/* <BaseLink to=""><BaseSvg href="logos/tg" size={30} /></BaseLink> */}
        <BaseLink external to={resourceUrls.medium}><BaseSvg href="logos/medium" size={30} /></BaseLink>
      </div>
    </header>
  )
}
