import dayjs from 'dayjs'
import type { FC } from 'react'
import { BaseRangeDatePicker, type BaseRangeDatePickerProps } from '../../date'
import type { BaseFilterComponentsProps, RangeDatePickFilterOptions } from '../type'
import { genValues } from '../utils'
import { FilterItemContainer } from './FilterItemContainer'

export type RangeDatePickFilterProps = BaseFilterComponentsProps & RangeDatePickFilterOptions

export const RangeDatePickFilter: FC<RangeDatePickFilterProps> = ({
  label,
  field,
  internalProps,
  value,
  format,
  onChange,
  onFilter,
}) => {
  const change: BaseRangeDatePickerProps['onChange'] = (value, _) => {
    const values = genValues(
      field,
      format ? value?.map((item) => dayjs(item).format(format)) : value,
    )
    onChange?.(values)
    onFilter?.(values)
  }
  return (
    <FilterItemContainer label={label}>
      <BaseRangeDatePicker
        allowClear
        // @ts-expect-error
        defaultValue={value}
        format={format}
        style={{ minWidth: 200 }}
        onChange={change}
        {...internalProps}
      />
    </FilterItemContainer>
  )
}
