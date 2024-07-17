import { useUpdateEffect } from 'ahooks'
import { useEffect } from 'react'
import { RouterPage, useRoute } from './router'
import { useInitTrackers } from './libs'
import { useAppStore, } from './store'
import { useBreakpoints, useSelector } from './hooks'

function App() {
  useInitTrackers()
  const breakoints = useBreakpoints()
  console.log("🚀 ~ breakoints:", breakoints)
  const { setBreakpoints, setChainId } = useAppStore(useSelector(['setBreakpoints', 'setChainId','address']))

  useEffect(() => {
    setBreakpoints(breakoints)
  }, [breakoints])


  const route = useRoute()
  if (import.meta.env.DEV) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (/debug=true/.test(location.search)) {
        import('eruda').then(({ default: eruda }) => {
          eruda.init()
        })
      }
    }, [])
  }
  useUpdateEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 0)
  }, [route.name])
  return (
    <div className="App">
      <RouterPage />
    </div>
  )
}

export default App
