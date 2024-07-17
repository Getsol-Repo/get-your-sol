import { Spin } from 'antd'
import clsx from 'clsx'
import { isObject } from 'lodash-es'
import { type ReactNode, cloneElement, useMemo } from 'react'
import styled from '@emotion/styled'
import { Empty } from '../result'
import type { BaseFC } from '@/types'

const StyledDiv = styled('div')({
  '&.state-container': {},
})
export interface StateContainerProps {
  /**
   * 数据源, 不传时并且loading为false时会直接显示children而不会再显示空状态
   */
  dataSource?: unknown
  /**
   * 是否加载中 传入auto时 如果没有数据源会把loading当true处理 有数据源会当成false处理 也可以显式传入true和false
   */
  loading?: boolean | 'auto'
  error?: boolean
  /**
   * 错误时显示的节点
   */
  errorNode?: ReactNode
  success?: boolean
  /**
   * 成功时显示的节点
   */
  successNode?: ReactNode
  /**
   * 加载时显示的节点, 默认为Spin
   */
  loadingNode?:
    | ReactNode
    | {
      /**
       * 无数据时显示的加载节点
       */
      noData?: ReactNode
      /**
       * 有数据时显示的加载节点
       */
      hasData?: ReactNode
    }
  /**
   * 加载节点是包裹子组件还是替换子组件, 比如Spin就是包裹子组件, 而Skeleton就是替换子组件, 假如加载节点传入Spin但是method却传入replace的话就会导致加载时候子元素内容不会显示, 变成空白, 假如设置成auto的话会在没有数据的时候用replace, 有数据的时候用wrap
   */
  loadingNodeMethod?: 'wrap' | 'replace' | 'auto'
  // 自定义空状态, 传null将不会显示空状态
  empty?: ReactNode
}
export const StateContainer: BaseFC<StateContainerProps> = (props) => {
  const {
    children,
    dataSource,
    loadingNodeMethod = 'replace',
    loading = false,
    loadingNode,
    empty,
    error = false,
    errorNode,
    success = false,
    successNode,
    className,
    ...rest
  } = props

  const hasData = useMemo(() => {
    if (!('dataSource' in props)) {
      return true
    }

    if (Array.isArray(dataSource)) {
      return !!dataSource.length
    }

    if (isObject(dataSource)) {
      return !!Object.keys(dataSource).length
    }

    return !!dataSource
  }, [dataSource])

  const emptyNode = empty !== undefined ? empty : <Empty />
  const currentLoading = useMemo(() => {
    if (loading === 'auto') {
      return !hasData
    }
    return loading
  }, [loading, hasData])
  const resultNode = useMemo(() => {
    if (error) {
      return errorNode
    }

    if (success) {
      return successNode
    }

    if (loadingNode) {
      if (currentLoading) {
        if (loadingNodeMethod === 'replace' || (loadingNodeMethod === 'auto' && !hasData)) {
          // @ts-expect-error
          return isObject(loadingNode) && loadingNode.noData !== undefined
          // @ts-expect-error
            ? loadingNode.noData
            : loadingNode
        }
        if (loadingNodeMethod === 'wrap' || (loadingNodeMethod === 'auto' && hasData)) {
          return cloneElement(
            // @ts-expect-error
            isObject(loadingNode) && loadingNode.hasData !== undefined
            // @ts-expect-error
              ? loadingNode.hasData
              : loadingNode,
            {
              children,
            },
          )
        }
      }
      if (hasData) {
        return children
      }
      return emptyNode
    }
    if (loadingNode === null) {
      return hasData ? children : emptyNode
    }
    return <Spin spinning={currentLoading}>{hasData ? children : emptyNode}</Spin>
  }, [
    hasData,
    currentLoading,
    dataSource,
    children,
    empty,
    loadingNodeMethod,
    loadingNode,
    emptyNode,
    error,
    errorNode,
    success,
    successNode,
  ])

  return (
    <StyledDiv className={clsx('state-container', className)} {...rest}>
      {resultNode}
    </StyledDiv>
  )
}
