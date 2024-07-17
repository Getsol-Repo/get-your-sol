/**
 * 分页请求参数
 */
type ListApiReq =
  | {
    offset?: number
    limit?: number
  }
  | {
    page?: number
    size?: number
  }
interface SortApiReq {
  sortOrder?: 'descend' | 'ascend'
}

/**
 * 分页响应参数
 */
interface ListApiRes {
  total: number
}

type ListApiResType<
  T extends (...args: any[]) => Promise<Omit<ListApiRes, 'total'>>,
  K extends keyof Required<Awaited<ReturnType<T>>> = 'list',
> = Required<Awaited<ReturnType<T>>>[K][number]
