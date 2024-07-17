import { Form, type FormItemProps } from 'antd'
import type { FC } from 'react'
import { BaseDatePicker, type BaseDatePickerProps } from './BaseDatePicker'

interface FormDatePickerProps
  extends FormItemProps,
  Pick<BaseDatePickerProps, 'placeholder' | 'disabled'> {
  fieldProps?: BaseDatePickerProps
}
export const FormDatePicker: FC<FormDatePickerProps> = ({
  fieldProps,
  placeholder,
  disabled,
  ...rest
}) => (
  <Form.Item {...rest}>
    <BaseDatePicker disabled={disabled} placeholder={placeholder} {...fieldProps} />
  </Form.Item>
)
