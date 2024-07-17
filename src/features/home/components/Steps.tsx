import type { BaseProps } from '@/types'
import { getStaticAssetsUrl } from '@/utils'

interface ImgWrapperProps extends BaseProps {

}

export function ImgWrapper(props: ImgWrapperProps) {
  const { className, style, ...rest } = props
  return <div className="of-hidden rounded-4.6 bg-#fff" style={{ boxShadow: '0px 9.265px 61.765px 0px rgba(82, 53, 232, 0.10)' }} {...rest} />
}

interface StepsProps extends BaseProps {

}

export function Steps(props: StepsProps) {
  const { ...rest } = props
  return (
    <div className="lg:()" style={{ background: 'linear-gradient(180deg, #FCFDFE 10.72%, #F7F6FE 93.03%)', boxShadow: '0px 4px 200px 0px rgba(232, 249, 247, 0.20)' }}>
      <div className="main-content flex items-center justify-between gap-12 py-25">
        <div className="lg:() flex flex-col gap-12">
          <div className="lg:() text-4 c-primary capitalize">
            Get started in seconds
          </div>
          {[
            'Connect  wallet or enter the address to check your claimable SOL amount.',
            'Sign once to close all your empty accounts and claim SOL.',
            'Share your invitation link with friends and earn 10% of the service fee!',
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="bg-1.5 h-12.5 w-12.5 flex-center rounded-1.5 bg-primary text-5 c-#fff">{i + 1}</span>
              <span className="text-4.5 c-#2A292E">{item}</span>
            </div>
          ))}
        </div>
        <div className="lg:() w-105 flex flex-col gap-8">
          <ImgWrapper>
            <img alt="" className="" src={getStaticAssetsUrl('/src/features/home/assets/images/desc-1.png')} />
          </ImgWrapper>
          <ImgWrapper>
            <img alt="" className="" src={getStaticAssetsUrl('/src/features/home/assets/images/desc-2.png')} />
          </ImgWrapper>
        </div>
      </div>
    </div>
  )
}
