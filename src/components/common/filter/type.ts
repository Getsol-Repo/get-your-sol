import type { DatePickerProps, SelectProps } from 'antd'
import type { RangePickerProps } from 'antd/lib/date-picker'
import type { SearchProps } from 'antd/lib/input'
import type { Dayjs } from 'dayjs'
import type { ReactNode } from 'react'
import type { ValueType } from '@libhub/utils'
import type { BaseInputProps } from '../input'
import type { BaseProps } from '@/types'

export type FilterType = 'search' | 'select' | 'datePick' | 'rangeDatePick' | 'input'

export interface BaseFilterOptions {
  label?: ReactNode
  /**
   * 筛选组件类型
   */
  type: FilterType
  /**
   * 筛选组件绑定的非受控默认值
   */
  value?: any | any[]
  /**
   * 筛选组件内部组件的props
   */
  internalProps?: unknown
}

export interface SearchFilterOptions<Values = Record<string, any>> extends BaseFilterOptions {
  type: 'search'
  value?: ValueType
  internalProps?: SearchProps
  /**
   * 筛选组件对应的字段名
   */
  field: keyof Values
}
export interface InputFilterOptions<Values = Record<string, any>> extends BaseFilterOptions {
  type: 'input'
  value?: ValueType
  internalProps?: BaseInputProps
  /**
   * 筛选组件对应的字段名
   */
  field: keyof Values
}
export interface SelectFilterOptions<Values = Record<string, any>> extends BaseFilterOptions {
  type: 'select'
  value?: ValueType | ValueType[]
  options: SelectProps['options']
  internalProps?: SelectProps
  /**
   * 筛选组件对应的字段名
   */
  field: keyof Values
}
export interface DatePickFilterOptions<Values = Record<string, any>> extends BaseFilterOptions {
  type: 'datePick'
  value?: Dayjs
  internalProps?: DatePickerProps
  /**
   * 筛选组件对应的字段名
   */
  field: keyof Values
  /**
   * 日期格式化格式 如果要更改日期显示格式得指定internalProps.format
   */
  format?: string
}
export interface RangeDatePickFilterOptions<Values = Record<string, any>>
  extends BaseFilterOptions {
  type: 'rangeDatePick'
  value?: [Dayjs?, Dayjs?]
  internalProps?: RangePickerProps
  /**
   * 筛选组件对应的字段名
   */
  field: [keyof Values, keyof Values] | keyof Values

  /**
   * 日期格式化格式 如果要更改日期显示格式得指定internalProps.format
   */
  format?: string
}
// 所有筛选组件的options
export type FilterOptions<Values = Record<string, any>> = (
  | SearchFilterOptions<Values>
  | SelectFilterOptions<Values>
  | DatePickFilterOptions<Values>
  | RangeDatePickFilterOptions<Values>
  | InputFilterOptions<Values>
)[]

// 筛选父组件的props
export type FilterProps<Values extends Record<string, any> = Record<string, any>> = BaseProps & {
  /**
   * 筛选组件对齐方式
   */
  align?: 'left' | 'right'
  /**
   * 筛选组件配置
   */
  options?: FilterOptions<Values>
  loading?: boolean
  /**
   * 筛选组件的值更改时执行
   */
  onChange?: (values: Partial<Values>) => void
  /**
   * 触发筛选时执行
   */
  onFilter?: (values: Partial<Values>) => void
  /**
   * 执行筛选方法之前执行, 可以在这里修改参数, 返回false可以阻止触发筛选事件
   */
  beforeFilter?: (values: Partial<Values>) => void | Values | boolean
}
// 筛选子组件基础props
export type BaseFilterComponentsProps = Pick<Required<FilterProps>, 'onChange' | 'onFilter'>
