import type { ListProps } from 'antd'
import type { DependencyList, Dispatch, ForwardedRef, ReactNode, SetStateAction } from 'react'
import type { PaginationConfig } from 'antd/lib/pagination'
import type { Options, Service } from 'ahooks/lib/useRequest/src/types'
import type { StrictOmit } from '@libhub/utils'
import type { FilterProps, StateContainerProps } from '../'
import type { BasicTarget } from '@/utils/common'

export interface BaseListProps<T = any, Params extends any[] = any[]>
  extends StrictOmit<ListProps<T>, 'children' | 'pagination' | 'dataSource'>,
  Pick<StateContainerProps, 'loadingNode' | 'loadingNodeMethod'> {
  /**
   * 请求参数 TODO: 改为defaultParams
   */
  params?: Params
  /**
   * 子元素, 可以在回调函数的参数里拿到整个数据源, 与renderItem的区别: renderItem的回调函数参数里拿到的是单项数据, 而children里拿到的是整个数据数组, 可以实现定制整个列表
   */
  children?: (dataSource: T[], info: { loading: boolean }) => ReactNode
  /**
   * 自定义空状态, 传入false时不显示空状态 (使用场景: 当需要自定义整个列表并且在空状态时显示自定义列表的空状态而不是BaseList本身自带的空状态, 比如给children传入表格在无数据时想显示表格自带的空状态, 即表头正常显示但表体显示无数据, 但是如果没有数据BaseList会直接把表格隐藏, 这时传入false即可)
   */
  empty?: ReactNode
  /**
   * 请求数据的函数
   */
  reqFn?: Service<ListApiRes & { list: T[] }, Params>
  fieldNames?: {
    /**
     * 响应数据的数组字段 默认为list
     */
    list: string
  }
  /**
   * 分页配置 false时不展示分页
   */
  pagination?: PaginationConfig | false
  paginationParamsType?: 'page-size' | 'offset-limit'

  listRef?: ForwardedRef<ListRef<T, Params>>
  /**
   * 依赖变化后自动刷新当前页面
   */
  refreshDeps?: DependencyList
  /**
   * 依赖变化后自动重置页码并刷新
   */
  reloadDeps?: DependencyList
  /**
   * 是否手动发起请求
   */
  ready?: boolean
  /**
   * 列表标题
   */
  title?: ReactNode
  /**
   * 筛选组件配置(可直接传入筛选组件的options或者筛选组件的props)
   */
  filter?:
    | FilterProps<NonNullable<Params[0]>>['options']
    | StrictOmit<FilterProps<NonNullable<Params[0]>>, 'onFilter'>

  /**
   * 列表头部的额外元素(与filter一起传入时会出现在filter右侧)
   */
  extra?: ReactNode
  /**
   * 列表头部的class
   */
  headerClass?: string
  /**
   * 传入时将组件内部将不会发送请求, 而是以此作为数据源, 用于数据源在外部获得的场景, 也可以作为没有接口时的mock数据
   */
  dataSource?: T[]
  /**
   * 受控loading
   */
  loading?: boolean
  /**
   * 隐藏刷新时的loading 可用于静默刷新场景
   */
  hideRefreshLoading?: boolean
  /**
   * 指定滚动容器 触底时将会加载下一页, 默认会使用最近的overflow为auto或scroll的父元素
   */
  scrollContainer?: BasicTarget
  /**
   * 指定加载更多数据的方式
   */
  loadMoreTrigger?: 'pagination' | 'scroll'
  listKey?: string | number
  persistPagination?: boolean
  requestOptions?: Options<ListApiRes & { list: T[] }, Params>
  nextPageControl?: {
    extraItemsToFetch?: number
    maintainPageSize?: boolean
    identitySelector?: keyof T | ((item: T) => any)
  }
}

export type ListRef<T = any, Params extends any[] = any[]> =
  | {
    setDataSource: Dispatch<SetStateAction<T[]>>
    dataSource: T[]
    // 刷新当前页
    refresh: () => Promise<(ListApiRes & { list: T[] }) | undefined>
    // 重置页码并刷新
    reload: () => void
    // 手动发起请求, 可传参
    run: (args: Params) => Promise<(ListApiRes & { list: T[] }) | undefined>
    setPage: (page: number) => void
    pageDown: () => void
  }
  | undefined
