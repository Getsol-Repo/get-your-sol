import { Input } from 'antd'
import type { FC } from 'react'
import type { BaseFilterComponentsProps, SearchFilterOptions } from '../type'
import { genValues } from '../utils'
import { useFilterContext } from '../context'
import { FilterItemContainer } from './FilterItemContainer'

export type SearchFilterProps = SearchFilterOptions & BaseFilterComponentsProps

export const SearchFilter: FC<SearchFilterProps> = (props) => {
  const { label, onChange, field, value, internalProps, onFilter } = props
  const { loading } = useFilterContext()
  return (
    <FilterItemContainer label={label}>
      <Input.Search
        allowClear
        enterButton
        defaultValue={value}
        loading={loading}
        onChange={(e) => {
          const values = genValues(field, e.target.value)
          onChange?.(values)
        }}
        onSearch={(e) => {
          const values = genValues(field, e)
          onFilter?.(values)
        }}
        {...internalProps}
      />
    </FilterItemContainer>
  )
}
