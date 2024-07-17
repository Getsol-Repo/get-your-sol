import { Form, type FormItemProps } from 'antd'
import type { FC } from 'react'
import { BaseRangeDatePicker, type BaseRangeDatePickerProps } from './BaseDatePicker'

interface FormRangeDatePickerProps
  extends FormItemProps,
  Pick<BaseRangeDatePickerProps, 'placeholder' | 'disabled'> {
  fieldProps?: BaseRangeDatePickerProps
}
export const FormRangeDatePicker: FC<FormRangeDatePickerProps> = ({
  fieldProps,
  placeholder,
  disabled,
  ...rest
}) => (
  <Form.Item {...rest}>
    <BaseRangeDatePicker disabled={disabled} placeholder={placeholder} {...fieldProps} />
  </Form.Item>
)
