import type { CSSProperties, FC, ReactNode } from 'react'

export interface BaseProps {
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

export type BaseFC<T extends Record<string, any> = Record<string, any>> = FC<BaseProps & T>
