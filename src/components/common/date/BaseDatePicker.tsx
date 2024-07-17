import styled from '@emotion/styled'
import { DatePicker, type DatePickerProps } from 'antd'
import type { RangePickerProps } from 'antd/lib/date-picker'
import type { FC } from 'react'

const StyledDatePick = styled(DatePicker)({
  '&.ant-picker': {
    borderWidth: 2,
  },
  '&.ant-picker-focused': {
    boxShadow: 'none',
  },
})

// TODO: 增加快捷时间选择
export type BaseDatePickerProps = DatePickerProps & {
  noStyle?: boolean
}
export const BaseDatePicker: FC<BaseDatePickerProps> = ({ noStyle, className = '', ...rest }) => {
  return <StyledDatePick className={`${noStyle ? 'no-style' : ''} ${className}`} {...rest} />
}

export type BaseRangeDatePickerProps = RangePickerProps & {
  noStyle?: boolean
}
export const BaseRangeDatePicker: FC<BaseRangeDatePickerProps> = ({
  noStyle,
  className = '',
  ...rest
}) => {
  return (
    <DatePicker.RangePicker className={`${noStyle ? 'no-style' : ''} ${className}`} {...rest} />
  )
}
