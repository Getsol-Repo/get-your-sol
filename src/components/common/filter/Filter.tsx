import { type FC, useMemo, useState } from 'react'
import { useDeepCompareEffect, useThrottleFn } from 'ahooks'
import type { FilterProps, FilterType } from './type'
import { DatePickFilter, InputFilter, RangeDatePickFilter, SearchFilter, SelectFilter } from './components'
import { FilterContext } from './context'

const filterComponentsMap: Record<FilterType, FC<any>> = {
  datePick: DatePickFilter,
  input: InputFilter,
  rangeDatePick: RangeDatePickFilter,
  search: SearchFilter,
  select: SelectFilter,
}

export function Filter<T extends Record<string, any>>({
  options,
  onChange,
  onFilter,
  className,
  beforeFilter,
  align,
  loading,
}: FilterProps<T>) {
  const [params, setParams] = useState<Partial<T>>()

  const { run: handleFilter } = useThrottleFn<Required<FilterProps<T>>['onFilter']>(
    (values) => {
      const tempValues = { ...params, ...values }
      setParams(tempValues)
      const result = beforeFilter?.(tempValues)
      if (result === false) {
        return
      }
      if (result === true) {
        onFilter?.(tempValues)
        return
      }
      // beforeFilter有返回值时就用返回值去触发筛选
      if (result) {
        onFilter?.(result)
        return
      }
      onFilter?.(tempValues)
    },
    { wait: 500 },
  )
  useDeepCompareEffect(() => {
    const params = options?.reduce<T>((values, { field, value }) => {
      if (Array.isArray(field)) {
        field.reduce((acc, item, i) => {
          if (Array.isArray(value)) {
            if (value[i] !== undefined && value[i] !== '') {
              // @ts-expect-error
              acc[item] = value[i]
            }
          } else {
            if (value !== undefined && value !== '') {
              // @ts-expect-error
              acc[item] = value
            }
          }
          return acc
        }, values)
      } else {
        // @ts-expect-error
        values[field] = value
      }
      return values
    }, {} as T)
    // options里有初始参数时手动触发筛选事件
    if (params && Object.keys(params).length > 0) {
      setParams(params)
      handleFilter?.(params)
    }
  }, [options])
  const handleChange: FilterProps<T>['onChange'] = (values) => {
    onChange?.(values)
  }
  const value = useMemo(() => ({ loading }), [loading])
  return (
    <FilterContext.Provider value={value}>
      <div
        className={`${align === 'right' ? 'justify-end' : 'justify-self-start'} ${className}`}
        style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}
      >
        {options?.map((item, index) => {
          const { type } = item
          const FilterComponent = filterComponentsMap[type]
          return (
            <FilterComponent
              {...item}
              key={index}
              onChange={handleChange}
              onFilter={handleFilter}
            />
          )
        })}
      </div>
    </FilterContext.Provider>
  )
}
