import { useDebounceFn, useEventListener, useInViewport, useLatest, useMemoizedFn, useRequest, useUpdateEffect } from 'ahooks'
import { Divider, List, type ListProps, type PaginationProps } from 'antd'
import { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { isObject, merge } from 'lodash-es'
import { BaseButton, type BaseListProps, Filter, type FilterProps, StateContainer } from '../'
import { findScrollContainer } from './utils'
import { useMergeState, useUnionIs } from '@/hooks'
import { type TargetValue, getTargetElement, notification } from '@/utils/common'
import { useRoute, useRouter } from '@/router'
import { PAGINATION_CONFIGS } from '@/constants/common/pagination'
import { appCache } from '@/utils/business'

const StyledList = styled(List)({
  '& .ant-list-pagination': {
    marginTop: 0,
  },
})

const { MAX_AUTO_REQUEST_COUNT, PAGE_DEFAULT, PAGE_KEY, PAGE_SIZE_DEFAULT, PAGE_SIZE_OPTIONS, PAGE_SIZE_KEY, PAGE_SIZE_OPTIONS_DEV } = PAGINATION_CONFIGS

export function BaseList<T, Params extends any[] = any[]>(props?: BaseListProps<T, Params>) {
  const {
    params,
    children,
    loadingNode,
    reqFn,
    pagination,
    listRef,
    refreshDeps = [],
    reloadDeps = [],
    className = '',
    paginationParamsType = 'page-size',
    empty,
    filter,
    title,
    extra,
    headerClass = '',
    dataSource,
    loading,
    hideRefreshLoading = false,
    scrollContainer,
    loadMoreTrigger = 'pagination',
    listKey,
    fieldNames,
    persistPagination = true,
    ready = true,
    loadingNodeMethod,
    requestOptions,
    nextPageControl,
    ...passedProps
  } = props || {}
  const { isPagination, isScroll } = useUnionIs(loadMoreTrigger)
  const route = useRoute()
  const router = useRouter()
  const listProp = fieldNames?.list || 'list'
  const needPagination = pagination !== false
  const pageSizeConfigs = appCache.get('page-size')

  const [page, setPage] = useState<number>()
  const [pageSize, setPageSize] = useState<number>()
  const pageReceived = route.query[PAGE_KEY] ? Number(route.query[PAGE_KEY]) : undefined
  const pageSizeRoute = route.query[PAGE_SIZE_KEY] ? Number(route.query[PAGE_SIZE_KEY]) : undefined
  const pageSizeLocal = listKey && pageSizeConfigs?.[listKey]
  const pageSizeReceived = pageSizeRoute || pageSizeLocal
  const [updateRouteFlag, setUpdateRouteFlag] = useState(0)
  const updateRoute = () => {
    setUpdateRouteFlag((num) => num + 1)
  }
  useEffect(() => {
    if (!ready) {
      return
    }
    if (needPagination && pagination?.current) {
      setPage(pagination.current)
      updateRoute()
    } else if (needPagination && persistPagination && pageReceived) {
      setPage(pageReceived)
    } else {
      setPage(PAGE_DEFAULT)
    }

    if (needPagination && pagination?.pageSize) {
      setPageSize(pagination.pageSize)
      updateRoute()
    } else if (needPagination && persistPagination && pageSizeReceived) {
      setPageSize(pageSizeReceived)
      // 路由里没有分页信息的时候分页变化了，需要更新路由
      if (!pageSizeRoute) {
        updateRoute()
      }
    } else {
      setPageSize(PAGE_SIZE_DEFAULT)
    }
  }, [
    needPagination,
    ...(isObject(pagination) ? [pagination?.current, pagination.pageSize] : []),
    persistPagination,
    pageReceived,
    pageSizeReceived,
    ready,
  ])

  const [total, setTotal] = useState<number>()

  const [ver, setVer] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [currentDataSource, setCurrentDataSource] = useMergeState<T[]>([], { value: dataSource })
  const isScrollLoading = useRef(false)
  const isEnterRequest = useRef(true)
  const [filterParams, setFilterParams] = useState<NonNullable<Params>>()
  const isNextPage = useRef(false)
  const lastPageAndPageSize = useRef<{
    page: number | undefined
    pageSize: number | undefined
  }>()
  useUpdateEffect(() => {
    if (isNextPage.current) {
      return
    }
    const last = lastPageAndPageSize.current
    if (last?.page || last?.pageSize) {
      isNextPage.current = true
    }
    lastPageAndPageSize.current = { page, pageSize }
  }, [page, pageSize])
  const {
    loading: reqLoading,
    runAsync,
    refreshAsync,
    cancel,
  } = useRequest(
    async (...args) => {
      if (!reqFn || dataSource || !page || !pageSize) {
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject()
      }
      const mergedParams = merge(args) as Record<string, any>[]
      const { page: currentPage, pageSize: currentPageSize, ...rest } = mergedParams[0]
      try {
        const controlNextPage = !!nextPageControl
        const { extraItemsToFetch = 0, identitySelector, maintainPageSize } = nextPageControl || {}
        const res = await reqFn(
          // @ts-expect-error
          {
            ...(paginationParamsType === 'offset-limit'
              ? {
                limit:
                    isNextPage.current && controlNextPage
                      ? currentPageSize + extraItemsToFetch
                      : currentPageSize,
                offset: (currentPage - 1) * currentPageSize,
              }
              : {
                page: currentPage,
                size: currentPageSize,
              }),

            ...rest,
          },
          ...mergedParams.slice(1),
        )
        const list = (res as unknown as Record<string, any[] | undefined>)[listProp] || []
        const total = Number(res.total)
        // TODO: 如果请求回来没有数据且外部没有传入分页参数就 通过total来判断 直接跳转到最近的有数据的那一页
        const hasMore = total > currentPageSize * currentPage
        setHasMore(hasMore)
        setCurrentDataSource(
          // isPagination || (isScroll && list.length === currentDataSource.length)
          (dataSource) => {
            if (isPagination) {
              return list
            }
            let newList = list
            if (identitySelector) {
              newList = list.filter(
                (item) =>
                  !dataSource.find((dataItem) => {
                    if (typeof identitySelector === 'function') {
                      return identitySelector(item) === identitySelector(dataItem)
                    }
                    return item[identitySelector] === dataItem[identitySelector]
                  }),
              )
            }
            if (maintainPageSize) {
              newList = newList.slice(0, currentPageSize)
            }
            // TODO: 当前请求还没返回的时候，用户又发起了下一次请求,需要舍弃上一次请求的数据 可能需要AbortController或者用发请求的时间记录
            return [...dataSource, ...newList]
          },
        )
        setTotal(total)
        return res
      } catch (err: any) {
        // isPagination && setCurrentDataSource([])
        notification.error(err.message || 'Unknown Error')
        return Promise.reject(err)
      } finally {
        isScrollLoading.current = false
        isEnterRequest.current = false
      }
    },
    {
      ready,
      ...requestOptions,
      manual: true,
    },
  )
  useUpdateEffect(() => {
    // @ts-expect-error
    !requestOptions?.manual && runAsync(...merge([{ page, pageSize }], params, filterParams))
  }, [loadMoreTrigger, page, pageSize, ver, requestOptions?.manual])
  const currentLoading = reqLoading
  const currentLoadingRef = useLatest(currentLoading)
  useEffect(() => {
    if (!dataSource) {
      return
    }
    setTotal(dataSource.length)
  }, [dataSource])
  const refresh = () => {
    setHasMore(true)
    cancel()
    return refreshAsync()
  }
  const autoRequestCount = useRef(0)
  const reload = useMemoizedFn(async () => {
    if (!ready) {
      return
    }
    console.log('reload list')
    isNextPage.current = false
    lastPageAndPageSize.current = undefined
    autoRequestCount.current = 0
    cancel()
    if (isScroll) {
      setCurrentDataSource([])
    }
    if (page === PAGE_DEFAULT) {
      setVer((ver) => ver + 1)
    } else {
      setPage(PAGE_DEFAULT)
      updateRoute()
    }
  })

  useUpdateEffect(() => {
    reload()
  }, reloadDeps)
  useUpdateEffect(() => {
    if (!ready) {
      return
    }
    setVer((ver) => ver + 1)
  }, refreshDeps)

  useUpdateEffect(() => {
    if (
      !persistPagination
      || !needPagination
      || isScroll
      || ((pageReceived || PAGE_DEFAULT) === page
      && (pageSizeReceived || PAGE_SIZE_DEFAULT) === pageSize)
    ) {
      return
    }

    router.push(
      {
        path: location.pathname,
        query: {
          [PAGE_KEY]: page,
          [PAGE_SIZE_KEY]: pageSize,
        },
      },
      {
        retainParams: ({ key }) => {
          if (key === PAGE_KEY) {
            return page ? page !== PAGE_DEFAULT : false
          }
          if (key === PAGE_SIZE_KEY) {
            return pageSize ? pageSize !== PAGE_SIZE_DEFAULT : false
          }
          return true
        },
      },
    )
    listKey && pageSize && appCache.set('page-size', { ...pageSizeConfigs, [listKey]: pageSize })
  }, [updateRouteFlag])

  const onChange: PaginationProps['onChange'] = (page: number, pageSize: number) => {
    setPage(page)
    setPageSize(pageSize)
    updateRoute()
    if (isObject(pagination)) {
      pagination.onChange?.(page, pageSize)
    }
  }
  const pageDown = useMemoizedFn(() => {
    page && setPage(page + 1)
  })
  useImperativeHandle(
    listRef,
    () => ({
      dataSource: currentDataSource,
      pageDown,
      refresh,
      reload,
      // @ts-expect-error
      run: runAsync,
      setDataSource: setCurrentDataSource,
      setPage,
    }),
    [currentDataSource],
  )
  const handleFilter: FilterProps<Params>['onFilter'] = (values) => {
    // @ts-expect-error
    setFilterParams([values])
    reload()
  }

  const filterProps = useMemo(() => {
    if (filter) {
      let props: FilterProps<Params> = {
        className: '',
        onFilter: handleFilter,
      }
      if (Array.isArray(filter)) {
        // eslint-disable-next-line react/prefer-destructuring-assignment
        props.options = filter
      } else {
        props = { ...props, ...filter }
      }
      // eslint-disable-next-line react/prefer-destructuring-assignment
      props.style = { ...props.style, marginLeft: 'auto' }
      return props
    }
    return null
  }, [filter, currentLoading])

  const rootRef = useRef<HTMLDivElement | null>(null)
  const prevScrollTop = useRef(0)
  const isScrollDown = useRef(false)
  const scrollContainerRef = useRef<TargetValue<Element>>(null)
  const [isHtmlScroll, setIsHtmlScroll] = useState(false)
  useEffect(() => {
    if (!isScroll) {
      return
    }
    if (scrollContainer) {
      scrollContainerRef.current = getTargetElement(scrollContainer)
    } else {
      scrollContainerRef.current = findScrollContainer(rootRef.current) || document.documentElement
    }
    setIsHtmlScroll(scrollContainerRef.current?.tagName === 'HTML')
  }, [scrollContainer, isScroll])
  const [showLoadMore, setShowLoadMore] = useState(false)
  const { run: handleScroll } = useDebounceFn(
    (e) => {
      const ele = isHtmlScroll ? document.documentElement : e.target
      if (!isScroll || isEnterRequest.current) {
        return
      }
      if (ele.scrollTop > prevScrollTop.current) {
        isScrollDown.current = true
      } else {
        isScrollDown.current = false
      }
      prevScrollTop.current = ele.scrollTop
      if (
        ele.scrollHeight - (ele.scrollTop + ele.clientHeight) <= 400
        && isScrollDown.current
        && !isScrollLoading.current
        && hasMore
        && !currentLoadingRef.current
      ) {
        isScrollLoading.current = true
        console.log('pagedown scroll')
        pageDown()
      }
    },
    { trailing: true, wait: 100, leading: true },
  )
  useEventListener('scroll', handleScroll, {
    capture: true,
    target: isHtmlScroll ? document : scrollContainerRef,
  })

  const [_, ratio] = useInViewport(rootRef, {
    threshold: isScroll ? [1] : undefined,
  })
  useEffect(() => {
    const ele = scrollContainerRef.current
    if (
      !ele
      || !isScroll
      || !hasMore
      || currentLoadingRef.current
      || ratio !== 1
      || isEnterRequest.current
    ) {
      setShowLoadMore(false)
      return
    }
    const diff = ele.scrollHeight - ele.clientHeight
    if (autoRequestCount.current < MAX_AUTO_REQUEST_COUNT && diff <= 400) {
      // if (autoRequestCount.current < MAX_AUTO_REQUEST_COUNT) {
      console.log('pagedown effect')
      setShowLoadMore(false)
      pageDown()
      autoRequestCount.current++
      return
    }
    if (diff === 0 && hasMore) {
      setShowLoadMore(true)
    }
  }, [ratio, currentLoading, hasMore, isScroll])

  return (
    <div ref={rootRef} className={`${className}`}>
      {(title || filter || extra) && (
        <div
          className={`flex gap-4 items-center ${headerClass}`}
          style={{ marginBottom: '1.25rem' }}
        >
          {title}
          {filterProps && <Filter {...filterProps} />}
          {extra}
        </div>
      )}
      {/* 空状态节点为false时不让StateContainer显示空状态 */}
      <StateContainer
        className="w-full"
        // TODO: empty为false时没数据也会显示分页
        dataSource={empty === false ? true : currentLoading ? true : !!total}
        empty={empty}
        loading={
          (isScroll && currentDataSource?.length)
          || (hideRefreshLoading && currentDataSource?.length)
            ? false
            : currentLoading
        }
        loadingNode={loadingNode}
        loadingNodeMethod={loadingNodeMethod}
      >
        {/* @ts-expect-error */}
        <StyledList
          dataSource={currentDataSource}
          itemLayout="vertical"
          pagination={
            isScroll
              ? false
              : needPagination
                ? ({
                  align: 'center',
                  pageSizeOptions: import.meta.env.PROD
                    ? PAGE_SIZE_OPTIONS
                    : PAGE_SIZE_OPTIONS_DEV,
                  showLessItems: true,
                  showQuickJumper: false,
                  showSizeChanger: true,
                  ...pagination,
                  current: page,
                  onChange,
                  pageSize,
                  total,
                } as ListProps<T>['pagination'])
                : pagination
          }
          {...passedProps}
        >
          {children?.(currentDataSource, { loading: currentLoading })}
          {showLoadMore && !currentLoading && (
            <div className="flex-center py-4">
              <BaseButton ghost type="primary" onClick={pageDown}>
                Load More
              </BaseButton>
            </div>
          )}
          {!hasMore && isScroll && !currentLoading && (
            <Divider plain className="px-4">
              It is all, nothing more 🤐
            </Divider>
          )}
        </StyledList>
      </StateContainer>
    </div>
  )
}
