import type { FC } from 'react'

interface FooterProps {}
export const Footer: FC<FooterProps> = (props) => {
  const { ...rest } = props
  return (
    <footer
      className="mt-a h-[var(--h-footer)] flex items-center bg-#F1F1F1 transition-all"
      style={{
        backgroundImage: ' linear-gradient(180deg, #FFF 10.72%, #F7F6FE 93.03%)',
        boxShadow: '0px 4px 200px 0px rgba(232, 249, 247, 0.20)',
      }}
    >
      <div className="main-content text-3.5 c-#939196">
        ©2024 Claim Ltd. All rights reserved.
      </div>
    </footer>
  )
}
