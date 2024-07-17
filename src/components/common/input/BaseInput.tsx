import styled from '@emotion/styled'
import { Input, type InputProps, type InputRef } from 'antd'
import clsx from 'clsx'
import { type ChangeEvent, type FC, type ReactNode, type Ref, forwardRef, useRef } from 'react'
import type { TextAreaProps } from 'antd/es/input'
import { isNaN } from 'lodash-es'
import type { StrictOmit } from '@libhub/utils'
import { useMergeState } from '@/hooks'

const StyledInput = styled(Input)({
  '&.ant-input,&.ant-input-group-wrapper .ant-input': {
    paddingLeft: '10px',
    paddingRight: '10px',
    // cursor: 'inherit',
  },
  '&.ant-input-affix-wrapper': {
    borderWidth: '2px',
  },
  '&.ant-input-affix-wrapper .ant-input-clear-icon': {
    color: '#d2d5dc',
    fontSize: '1em',
  },
  '&.ant-input-affix-wrapper,& .ant-input': { backgroundColor: '#fff' },
  '& .ant-input': {
    // cursor: 'inherit',
  },
  '&.ant-input-affix-wrapper:focus, &.ant-input-affix-wrapper-focused': {
    boxShadow: 'unset',
  },

  '&.ant-input-group-wrapper': {
    borderWidth: '2px',
  },
  '&.ant-input-sm,&.ant-input-group-wrapper .ant-input-sm': {
    fontSize: '14px',
  },
  '&.ant-input::placeholder': {
    color: '#838385',
  },
  '&.ant-input:focus, &.ant-input-focused': {
    borderColor: 'var(--c-primary)',
  },
  '&.ant-input-outlined:focus, &.ant-input-outlined:focus-within': {
    borderColor: 'var(--c-primary)',
  },
  // '&.ant-input-affix-wrapper:not(.ant-input-affix-wrapper-disabled),&.ant-input-affix-wrapper:not(.ant-input-affix-wrapper-disabled):hover':
  //  {
  //   borderWidth: '2px',
  //   borderColor: '#E1E4E8',
  //  },
  '&.ant-input:not(:focus),&.ant-input-group-wrapper .ant-input:not(:focus),&.ant-input-affix-wrapper:not(.ant-input-affix-wrapper-focused),&.ant-input-affix-wrapper .ant-input:not(:focus)':
    {
      // backgroundColor: '#fbfbfb',
      borderColor: '#7BA0FF',
      borderWidth: '2px',
      color: 'var(--c-primary)',
    },
})
const StyledDiv = styled('div')({
  '&': {
    '.addon-top-wrapper': {
      paddingInline: '10px',
      paddingTop: '9px',
    },
    // backgroundColor: '#2d3448',
    borderRadius: '10px',
    display: 'inline-block',
  },
})
export interface BaseInputProps extends StrictOmit<InputProps, 'size'> {
  size?: InputProps['size']
  /**
   * 是否是数字类型
   */
  number?: boolean
  /**
   * 精度 默认不限制 设置了限制后 不允许输入超过进度的小数点后的数字
   */
  presicion?: number
  max?: number
  min?: number
  addonTop?: ReactNode
  ref?: Ref<InputRef>
}
// @ts-expect-error
export const BaseInput: FC<BaseInputProps> & { TextArea: typeof BaseTextArea } = forwardRef<
  InputRef,
  BaseInputProps
>(
  (
    {
      className,
      presicion,
      number = false,
      defaultValue,
      max = Number.POSITIVE_INFINITY,
      min = Number.NEGATIVE_INFINITY,
      value,
      addonTop,
      allowClear = true,
      status,
      onChange,
      onCompositionStart,
      onCompositionEnd,
      ...rest
    },
    ref,
  ) => {
    const [currentValue, setCurrentValue] = useMergeState(undefined, { defaultValue, value })
    const isComsing = useRef(false)
    // 处理输入更改
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let inputValue = e.target.value

      if (number && !isComsing.current) {
        // 只保留数字、小数点和负号（如果最小值小于0）
        const regex = min < 0 ? /[^0-9.-]/g : /[^0-9.]/g
        inputValue = inputValue.replace(regex, '')

        // 处理精度
        if (presicion !== undefined && inputValue.includes('.')) {
          const parts = inputValue.split('.')
          if (presicion === 0) {
            inputValue = parts[0]
          } else if (parts[1].length > presicion) {
            inputValue = `${parts[0]}.${parts[1].slice(0, presicion)}`
          }
        }

        // 转换为数字并处理最大值和最小值
        const numericValue = Number.parseFloat(inputValue)
        if (!isNaN(numericValue)) {
          if (max !== undefined && numericValue > max) {
            inputValue = max.toString()
          }
          if (min !== undefined && numericValue < min) {
            inputValue = min.toString()
          }
        }
      }

      setCurrentValue(inputValue)
      onChange?.({ ...e, target: { ...e.target, value: inputValue } })
    }
    const inputEl = (
      <StyledInput
        ref={ref}
        allowClear={allowClear}
        className={clsx(className)}
        value={currentValue}
        onChange={handleChange}
        onCompositionEnd={(e) => {
          isComsing.current = false
          number && handleChange(e as unknown as ChangeEvent<HTMLInputElement>)
          onCompositionEnd?.(e)
        }}
        onCompositionStart={(e) => {
          isComsing.current = true
          onCompositionStart?.(e)
        }}
        {...rest}
      />
    )

    return addonTop ? (
      <StyledDiv>
        <div className="addon-top-wrapper">{addonTop}</div>
        {inputEl}
      </StyledDiv>
    ) : (
      inputEl
    )
  },
)
BaseInput.displayName = 'Input'
const StyledTextArea = styled(Input.TextArea)({
  '&.ant-input:not(.ant-input-borderless)': {
    border: '2px solid #E1E4E8',
  },
})

interface BaseTextAreaProps extends TextAreaProps {}

export function BaseTextArea(props: BaseTextAreaProps) {
  const { ...rest } = props
  return <StyledTextArea {...rest} />
}

BaseInput.TextArea = BaseTextArea
