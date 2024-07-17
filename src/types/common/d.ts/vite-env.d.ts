/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_APP_NAME: string
  VITE_APP_VERSION: string
  /**
   * 接口地址
   */
  VITE_API_URL: string
  VITE_APP_URL: string
  VITE_SUPPORTED_CHAIN_IDS: string
  VITE_SUPPORTED_CUSTOM_CHAIN_IDS: string
  VITE_HELIUS_API_KEY: string
  VITE_PLATFORM_ADDRESS: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
