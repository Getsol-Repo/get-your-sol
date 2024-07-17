import { useOutlet } from 'react-router-dom'
import clsx from 'clsx'
import { Header } from './Header'
import { Footer } from './Footer'

export function Layout() {
  const outlet = useOutlet()
  return (
    <>
      <div
        className={clsx('min-h-[calc(100vh-var(--h-header))] bg-no-repeat bg-cover flex flex-col bg-center',
        )}
      >
        <Header />
        {outlet}
      </div>
      <Footer />
    </>
  )
}
