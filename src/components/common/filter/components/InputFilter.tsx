import type { FC } from 'react'
import { BaseInput, BaseSvg } from '../..'
import type { BaseFilterComponentsProps, InputFilterOptions } from '../type'
import { genValues } from '../utils'
import { FilterItemContainer } from './FilterItemContainer'

export type InputFilterProps = InputFilterOptions & BaseFilterComponentsProps

export const InputFilter: FC<InputFilterProps> = (props) => {
  const { label, onChange, field, value, internalProps, onFilter } = props

  return (
    <FilterItemContainer label={label}>
      <BaseInput
        className="w-75"
        defaultValue={value}
        suffix={<BaseSvg className="c-#E1E4E8" href="outlined/search" size={24} />}
        {...internalProps}
        onChange={(e) => {
          const values = genValues(field, e.target.value)
          onChange?.(values)
          onFilter?.(values)
        }}
      />
    </FilterItemContainer>
  )
}
