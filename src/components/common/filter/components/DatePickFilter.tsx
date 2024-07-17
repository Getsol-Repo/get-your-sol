import type { DatePickerProps } from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import type { FC } from 'react'
import { BaseDatePicker } from '../../date'
import type { BaseFilterComponentsProps, DatePickFilterOptions } from '../type'
import { genValues } from '../utils'
import { FilterItemContainer } from './FilterItemContainer'

export type DatePickFilterProps = BaseFilterComponentsProps & DatePickFilterOptions

export const DatePickFilter: FC<DatePickFilterProps> = ({
  label,
  field,
  internalProps,
  value,
  format,
  onChange,
  onFilter,
}) => {
  const change: DatePickerProps['onChange'] = (value, _) => {
    const values = genValues(field, format ? dayjs(value as Dayjs).format(format) : value)
    onChange?.(values)
    onFilter?.(values)
  }
  return (
    <FilterItemContainer label={label}>
      <BaseDatePicker
        allowClear
        defaultValue={value}
        format={format}
        style={{ minWidth: 200 }}
        onChange={change}
        {...internalProps}
      />
    </FilterItemContainer>
  )
}
