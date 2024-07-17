import { Select, type SelectProps } from 'antd'
import type { FC } from 'react'
import type { BaseFilterComponentsProps, SelectFilterOptions } from '../type'
import { genValues } from '../utils'
import { FilterItemContainer } from './FilterItemContainer'

export type SelectFilterProps = SelectFilterOptions & BaseFilterComponentsProps

export const SelectFilter: FC<SelectFilterProps> = ({
  label,
  options,
  onChange,
  field,
  onFilter,
  internalProps,
  value,
}) => {
  const change: SelectProps['onChange'] = (value) => {
    const values = genValues(field, value)
    onChange?.(values)
    onFilter?.(values)
  }
  return (
    <FilterItemContainer label={label}>
      <Select
        allowClear
        showArrow
        className="min-w-50"
        defaultValue={value}
        options={options}
        onChange={change}
        {...internalProps}
      />
    </FilterItemContainer>
  )
}
