import { App as AntdApp, ConfigProvider } from 'antd'
import { BrowserRouter } from 'react-router-dom'
import { StyleProvider, legacyLogicalPropertiesTransformer } from '@ant-design/cssinjs'
import { createRoot } from 'react-dom/client'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import dayjs from 'dayjs'
import { PhantomWallet, SolanaWeb3ConfigProvider } from '@ant-design/web3-solana'
import { RouterProvider, routeRecordRaw } from './router'
import App from './App'
import { antdTheme, initAhooks } from './libs'

import 'virtual:svg-icons-register'
import 'core-js/stable'
import 'regenerator-runtime'

import '@unocss/reset/sanitize/sanitize.css'
import '@unocss/reset/sanitize/assets.css'
import 'uno.css'
import './styles/index.less'

initAhooks()
dayjs.extend(utc)
dayjs.extend(timezone)

createRoot(document.getElementById('root') as HTMLElement).render(
  // <ErrorBoundary>
  <SolanaWeb3ConfigProvider
    autoAddRegisteredWallets
    autoConnect
    // chains={[solana, solanaDevnet]}
    rpcProvider={(chain) => `https://go.getblock.io/689a732eaccf405f8e238ac7e067a005`}
    walletConnect={{ projectId: '99d2ea7e76f1658c147b74ebaba6439d' }}
    wallets={[PhantomWallet()]}
  >
    <ConfigProvider theme={antdTheme}>
      <AntdApp>
        {/* support legency browsers */}
        <StyleProvider transformers={[legacyLogicalPropertiesTransformer]}>
          <BrowserRouter>
            <RouterProvider routes={routeRecordRaw}>
              <App />
            </RouterProvider>
          </BrowserRouter>
        </StyleProvider>
      </AntdApp>
    </ConfigProvider>
  </SolanaWeb3ConfigProvider>
  ,
  // </ErrorBoundary>
)
